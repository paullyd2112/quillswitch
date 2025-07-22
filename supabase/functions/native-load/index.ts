import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-connection-id',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface LoadRequest {
  connectionId: string;
  objectType: string;
  data: any[];
  operation: 'insert' | 'update' | 'upsert';
  batchSize?: number;
  validateOnly?: boolean;
}

interface LoadResult {
  success: boolean;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  results: Array<{
    success: boolean;
    id?: string;
    error?: string;
    record?: any;
  }>;
  summary: {
    processingTime: number;
    averageRecordsPerSecond: number;
    errors: string[];
  };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const crmSystem = pathParts[pathParts.length - 2]; // e.g., 'salesforce'
    const objectType = pathParts[pathParts.length - 1]; // e.g., 'contacts'
    
    const connectionId = req.headers.get('X-Connection-ID');
    if (!connectionId) {
      throw new Error('X-Connection-ID header is required');
    }

    const loadRequest: LoadRequest = await req.json();
    loadRequest.connectionId = connectionId;

    console.log(`Loading ${loadRequest.data.length} ${objectType} records to ${crmSystem} for connection ${connectionId}`);

    // Get decrypted credentials
    const { data: credentials } = await supabase
      .rpc('get_decrypted_credential_with_logging', {
        p_credential_id: connectionId
      });

    if (!credentials || credentials.length === 0) {
      throw new Error('Connection credentials not found');
    }

    const credential = credentials[0];
    console.log(`Found credential for service: ${credential.service_name}`);

    const startTime = Date.now();
    let loadResult: LoadResult;

    // Route to appropriate CRM loading logic
    switch (crmSystem.toLowerCase()) {
      case 'salesforce':
        loadResult = await loadToSalesforce(credential, loadRequest);
        break;
      case 'hubspot':
        loadResult = await loadToHubSpot(credential, loadRequest);
        break;
      case 'dynamics':
        loadResult = await loadToDynamics(credential, loadRequest);
        break;
      case 'pipedrive':
        loadResult = await loadToPipedrive(credential, loadRequest);
        break;
      case 'zendesk-sell':
        loadResult = await loadToZendeskSell(credential, loadRequest);
        break;
      case 'monday':
        loadResult = await loadToMonday(credential, loadRequest);
        break;
      default:
        throw new Error(`Unsupported CRM system: ${crmSystem}`);
    }

    const processingTime = Date.now() - startTime;
    loadResult.summary.processingTime = processingTime;
    loadResult.summary.averageRecordsPerSecond = loadResult.totalRecords / (processingTime / 1000);

    console.log(`Load complete: ${loadResult.successfulRecords}/${loadResult.totalRecords} records processed successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        ...loadResult,
        metadata: {
          crmSystem,
          objectType,
          loadedAt: new Date().toISOString()
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Data loading error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function loadToSalesforce(credential: any, request: LoadRequest): Promise<LoadResult> {
  const { access_token, instance_url } = JSON.parse(credential.credential_value);
  const batchSize = request.batchSize || 200; // Salesforce supports up to 200 records per batch
  
  // Map object types to Salesforce API objects
  const objectMapping: Record<string, string> = {
    'contacts': 'Contact',
    'accounts': 'Account',
    'opportunities': 'Opportunity',
    'leads': 'Lead'
  };

  const sfObjectType = objectMapping[request.objectType.toLowerCase()] || request.objectType;
  
  const results: LoadResult['results'] = [];
  const errors: string[] = [];
  
  // Process in batches using Salesforce Composite API
  for (let i = 0; i < request.data.length; i += batchSize) {
    const batch = request.data.slice(i, i + batchSize);
    
    const compositeRequest = {
      allOrNone: false,
      compositeRequest: batch.map((record, index) => ({
        method: request.operation === 'insert' ? 'POST' : 'PATCH',
        url: request.operation === 'insert' 
          ? `/services/data/v57.0/sobjects/${sfObjectType}/`
          : `/services/data/v57.0/sobjects/${sfObjectType}/${record.Id}`,
        referenceId: `ref${i + index}`,
        body: record
      }))
    };

    try {
      const response = await fetch(`${instance_url}/services/data/v57.0/composite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(compositeRequest)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Salesforce API error: ${response.status} - ${errorText}`);
      }

      const batchResult = await response.json();
      
      // Process batch results
      batchResult.compositeResponse.forEach((result: any, index: number) => {
        const originalRecord = batch[index];
        
        if (result.httpStatusCode >= 200 && result.httpStatusCode < 300) {
          results.push({
            success: true,
            id: result.body?.id || result.body?.Id,
            record: originalRecord
          });
        } else {
          const errorMessage = result.body?.message || `HTTP ${result.httpStatusCode}`;
          results.push({
            success: false,
            error: errorMessage,
            record: originalRecord
          });
          errors.push(`Record ${i + index}: ${errorMessage}`);
        }
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      batch.forEach((record, index) => {
        results.push({
          success: false,
          error: errorMessage,
          record
        });
        errors.push(`Batch ${i}-${i + batchSize - 1}: ${errorMessage}`);
      });
    }
  }

  const successfulRecords = results.filter(r => r.success).length;
  
  return {
    success: true,
    totalRecords: request.data.length,
    successfulRecords,
    failedRecords: request.data.length - successfulRecords,
    results,
    summary: {
      processingTime: 0, // Will be set by caller
      averageRecordsPerSecond: 0, // Will be set by caller
      errors
    }
  };
}

async function loadToHubSpot(credential: any, request: LoadRequest): Promise<LoadResult> {
  const { access_token } = JSON.parse(credential.credential_value);
  const batchSize = request.batchSize || 100; // HubSpot supports up to 100 records per batch

  // Map object types to HubSpot objects
  const objectMapping: Record<string, string> = {
    'contacts': 'contacts',
    'companies': 'companies',
    'deals': 'deals',
    'tickets': 'tickets'
  };

  const hsObjectType = objectMapping[request.objectType.toLowerCase()] || request.objectType;
  
  const results: LoadResult['results'] = [];
  const errors: string[] = [];

  // Process in batches
  for (let i = 0; i < request.data.length; i += batchSize) {
    const batch = request.data.slice(i, i + batchSize);
    
    const batchRequest = {
      inputs: batch.map(record => ({
        properties: record
      }))
    };

    try {
      const endpoint = request.operation === 'update' 
        ? `https://api.hubapi.com/crm/v3/objects/${hsObjectType}/batch/update`
        : `https://api.hubapi.com/crm/v3/objects/${hsObjectType}/batch/create`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(batchRequest)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HubSpot API error: ${response.status} - ${errorText}`);
      }

      const batchResult = await response.json();
      
      // Process successful results
      batchResult.results?.forEach((result: any, index: number) => {
        results.push({
          success: true,
          id: result.id,
          record: batch[index]
        });
      });

      // Process errors if any
      if (batchResult.errors) {
        batchResult.errors.forEach((error: any) => {
          const errorMessage = error.message || 'Unknown error';
          results.push({
            success: false,
            error: errorMessage,
            record: batch[error.context?.index || 0]
          });
          errors.push(errorMessage);
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      batch.forEach((record) => {
        results.push({
          success: false,
          error: errorMessage,
          record
        });
        errors.push(errorMessage);
      });
    }
  }

  const successfulRecords = results.filter(r => r.success).length;
  
  return {
    success: true,
    totalRecords: request.data.length,
    successfulRecords,
    failedRecords: request.data.length - successfulRecords,
    results,
    summary: {
      processingTime: 0,
      averageRecordsPerSecond: 0,
      errors
    }
  };
}

async function loadToDynamics(credential: any, request: LoadRequest): Promise<LoadResult> {
  const { access_token, instance_url } = JSON.parse(credential.credential_value);
  
  // Map object types to Dynamics entities
  const objectMapping: Record<string, string> = {
    'contacts': 'contacts',
    'accounts': 'accounts',
    'opportunities': 'opportunities',
    'leads': 'leads'
  };

  const dynamicsEntity = objectMapping[request.objectType.toLowerCase()] || request.objectType;
  
  const results: LoadResult['results'] = [];
  const errors: string[] = [];

  // Dynamics doesn't have batch API, process individually
  for (let i = 0; i < request.data.length; i++) {
    const record = request.data[i];
    
    try {
      const endpoint = request.operation === 'update' && record.id
        ? `${instance_url}/api/data/v9.2/${dynamicsEntity}(${record.id})`
        : `${instance_url}/api/data/v9.2/${dynamicsEntity}`;

      const method = request.operation === 'update' ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
          'OData-MaxVersion': '4.0',
          'OData-Version': '4.0'
        },
        body: JSON.stringify(record)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Dynamics API error: ${response.status} - ${errorText}`);
      }

      const location = response.headers.get('OData-EntityId');
      const id = location?.match(/\(([^)]+)\)/)?.[1];

      results.push({
        success: true,
        id: id || 'created',
        record
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.push({
        success: false,
        error: errorMessage,
        record
      });
      errors.push(`Record ${i}: ${errorMessage}`);
    }
  }

  const successfulRecords = results.filter(r => r.success).length;
  
  return {
    success: true,
    totalRecords: request.data.length,
    successfulRecords,
    failedRecords: request.data.length - successfulRecords,
    results,
    summary: {
      processingTime: 0,
      averageRecordsPerSecond: 0,
      errors
    }
  };
}

async function loadToPipedrive(credential: any, request: LoadRequest): Promise<LoadResult> {
  const apiToken = credential.credential_value;
  
  // Map object types to Pipedrive endpoints
  const objectMapping: Record<string, string> = {
    'persons': 'persons',
    'organizations': 'organizations',
    'deals': 'deals',
    'activities': 'activities'
  };

  const pipedriveEndpoint = objectMapping[request.objectType.toLowerCase()] || request.objectType;
  
  const results: LoadResult['results'] = [];
  const errors: string[] = [];

  // Pipedrive doesn't have batch API, process individually
  for (let i = 0; i < request.data.length; i++) {
    const record = request.data[i];
    
    try {
      const endpoint = request.operation === 'update' && record.id
        ? `https://api.pipedrive.com/v1/${pipedriveEndpoint}/${record.id}?api_token=${apiToken}`
        : `https://api.pipedrive.com/v1/${pipedriveEndpoint}?api_token=${apiToken}`;

      const method = request.operation === 'update' ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(record)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Pipedrive API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      results.push({
        success: true,
        id: result.data?.id?.toString(),
        record
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.push({
        success: false,
        error: errorMessage,
        record
      });
      errors.push(`Record ${i}: ${errorMessage}`);
    }
  }

  const successfulRecords = results.filter(r => r.success).length;
  
  return {
    success: true,
    totalRecords: request.data.length,
    successfulRecords,
    failedRecords: request.data.length - successfulRecords,
    results,
    summary: {
      processingTime: 0,
      averageRecordsPerSecond: 0,
      errors
    }
  };
}

async function loadToZendeskSell(credential: any, request: LoadRequest): Promise<LoadResult> {
  const apiToken = credential.credential_value;
  
  // Map object types to Zendesk Sell endpoints
  const objectMapping: Record<string, string> = {
    'contacts': 'contacts',
    'deals': 'deals',
    'leads': 'leads'
  };

  const zendeskEndpoint = objectMapping[request.objectType.toLowerCase()] || request.objectType;
  
  const results: LoadResult['results'] = [];
  const errors: string[] = [];

  // Zendesk Sell doesn't have batch API, process individually
  for (let i = 0; i < request.data.length; i++) {
    const record = request.data[i];
    
    try {
      const endpoint = request.operation === 'update' && record.id
        ? `https://api.getbase.com/v2/${zendeskEndpoint}/${record.id}`
        : `https://api.getbase.com/v2/${zendeskEndpoint}`;

      const method = request.operation === 'update' ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: record })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Zendesk Sell API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      results.push({
        success: true,
        id: result.data?.id?.toString(),
        record
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.push({
        success: false,
        error: errorMessage,
        record
      });
      errors.push(`Record ${i}: ${errorMessage}`);
    }
  }

  const successfulRecords = results.filter(r => r.success).length;
  
  return {
    success: true,
    totalRecords: request.data.length,
    successfulRecords,
    failedRecords: request.data.length - successfulRecords,
    results,
    summary: {
      processingTime: 0,
      averageRecordsPerSecond: 0,
      errors
    }
  };
}

async function loadToMonday(credential: any, request: LoadRequest): Promise<LoadResult> {
  const apiToken = credential.credential_value;
  
  const results: LoadResult['results'] = [];
  const errors: string[] = [];

  // Monday.com uses GraphQL mutations
  for (let i = 0; i < request.data.length; i++) {
    const record = request.data[i];
    
    try {
      const mutation = request.operation === 'update' && record.id
        ? `mutation {
            change_multiple_column_values(item_id: ${record.id}, board_id: ${record.board_id}, column_values: "${JSON.stringify(record.column_values).replace(/"/g, '\\"')}") {
              id
            }
          }`
        : `mutation {
            create_item(board_id: ${record.board_id}, item_name: "${record.name}", column_values: "${JSON.stringify(record.column_values || {}).replace(/"/g, '\\"')}") {
              id
            }
          }`;

      const response = await fetch('https://api.monday.com/v2', {
        method: 'POST',
        headers: {
          'Authorization': apiToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: mutation })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Monday.com API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      const itemData = result.data?.create_item || result.data?.change_multiple_column_values;

      results.push({
        success: true,
        id: itemData?.id,
        record
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.push({
        success: false,
        error: errorMessage,
        record
      });
      errors.push(`Record ${i}: ${errorMessage}`);
    }
  }

  const successfulRecords = results.filter(r => r.success).length;
  
  return {
    success: true,
    totalRecords: request.data.length,
    successfulRecords,
    failedRecords: request.data.length - successfulRecords,
    results,
    summary: {
      processingTime: 0,
      averageRecordsPerSecond: 0,
      errors
    }
  };
}