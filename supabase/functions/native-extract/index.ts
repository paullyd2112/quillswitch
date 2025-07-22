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

interface ExtractionRequest {
  connectionId: string;
  batchSize?: number;
  offset?: number;
  filters?: Record<string, any>;
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

    console.log(`Extracting ${objectType} from ${crmSystem} for connection ${connectionId}`);

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

    // Parse request body for extraction parameters
    let extractionParams: ExtractionRequest = { connectionId };
    if (req.method === 'POST') {
      const body = await req.json();
      extractionParams = { ...extractionParams, ...body };
    }

    let extractedData: any[] = [];

    // Route to appropriate CRM extraction logic
    switch (crmSystem.toLowerCase()) {
      case 'salesforce':
        extractedData = await extractSalesforceData(credential, objectType, extractionParams);
        break;
      case 'hubspot':
        extractedData = await extractHubSpotData(credential, objectType, extractionParams);
        break;
      case 'dynamics':
        extractedData = await extractDynamicsData(credential, objectType, extractionParams);
        break;
      case 'pipedrive':
        extractedData = await extractPipedriveData(credential, objectType, extractionParams);
        break;
      case 'zendesk-sell':
        extractedData = await extractZendeskSellData(credential, objectType, extractionParams);
        break;
      case 'monday':
        extractedData = await extractMondayData(credential, objectType, extractionParams);
        break;
      default:
        throw new Error(`Unsupported CRM system: ${crmSystem}`);
    }

    console.log(`Extracted ${extractedData.length} ${objectType} records from ${crmSystem}`);

    return new Response(
      JSON.stringify({
        success: true,
        data: extractedData,
        metadata: {
          crmSystem,
          objectType,
          recordCount: extractedData.length,
          extractedAt: new Date().toISOString()
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Data extraction error:', error);
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

async function extractSalesforceData(credential: any, objectType: string, params: ExtractionRequest): Promise<any[]> {
  const { access_token, instance_url } = JSON.parse(credential.credential_value);
  const batchSize = params.batchSize || 1000;
  const offset = params.offset || 0;

  // Map object types to Salesforce API objects
  const objectMapping: Record<string, string> = {
    'contacts': 'Contact',
    'accounts': 'Account', 
    'opportunities': 'Opportunity',
    'leads': 'Lead',
    'cases': 'Case'
  };

  const sfObjectType = objectMapping[objectType.toLowerCase()] || objectType;
  
  // Build SOQL query
  let soqlQuery = `SELECT FIELDS(ALL) FROM ${sfObjectType} LIMIT ${batchSize} OFFSET ${offset}`;
  
  // Apply filters if provided
  if (params.filters && Object.keys(params.filters).length > 0) {
    const whereConditions = Object.entries(params.filters)
      .map(([field, value]) => `${field} = '${value}'`)
      .join(' AND ');
    soqlQuery = soqlQuery.replace(' LIMIT', ` WHERE ${whereConditions} LIMIT`);
  }

  const response = await fetch(`${instance_url}/services/data/v57.0/query?q=${encodeURIComponent(soqlQuery)}`, {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Salesforce API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result.records || [];
}

async function extractHubSpotData(credential: any, objectType: string, params: ExtractionRequest): Promise<any[]> {
  const { access_token } = JSON.parse(credential.credential_value);
  const batchSize = params.batchSize || 100;
  const offset = params.offset || 0;

  // Map object types to HubSpot API endpoints
  const objectMapping: Record<string, string> = {
    'contacts': 'contacts',
    'companies': 'companies',
    'deals': 'deals',
    'tickets': 'tickets'
  };

  const hsObjectType = objectMapping[objectType.toLowerCase()] || objectType;
  
  const response = await fetch(`https://api.hubapi.com/crm/v3/objects/${hsObjectType}?limit=${batchSize}&after=${offset}`, {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HubSpot API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result.results || [];
}

async function extractDynamicsData(credential: any, objectType: string, params: ExtractionRequest): Promise<any[]> {
  const { access_token, instance_url } = JSON.parse(credential.credential_value);
  const batchSize = params.batchSize || 100;
  const offset = params.offset || 0;

  // Map object types to Dynamics API entities
  const objectMapping: Record<string, string> = {
    'contacts': 'contacts',
    'accounts': 'accounts',
    'opportunities': 'opportunities',
    'leads': 'leads'
  };

  const dynamicsEntity = objectMapping[objectType.toLowerCase()] || objectType;
  
  const response = await fetch(`${instance_url}/api/data/v9.2/${dynamicsEntity}?$top=${batchSize}&$skip=${offset}`, {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Dynamics API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result.value || [];
}

async function extractPipedriveData(credential: any, objectType: string, params: ExtractionRequest): Promise<any[]> {
  const apiToken = credential.credential_value;
  const batchSize = params.batchSize || 100;
  const offset = params.offset || 0;

  // Map object types to Pipedrive API endpoints
  const objectMapping: Record<string, string> = {
    'persons': 'persons',
    'organizations': 'organizations', 
    'deals': 'deals',
    'activities': 'activities'
  };

  const pipedriveEndpoint = objectMapping[objectType.toLowerCase()] || objectType;
  
  const response = await fetch(`https://api.pipedrive.com/v1/${pipedriveEndpoint}?api_token=${apiToken}&limit=${batchSize}&start=${offset}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pipedrive API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result.data || [];
}

async function extractZendeskSellData(credential: any, objectType: string, params: ExtractionRequest): Promise<any[]> {
  const apiToken = credential.credential_value;
  const batchSize = params.batchSize || 100;
  const offset = params.offset || 1; // Zendesk uses 1-based pagination

  // Map object types to Zendesk Sell API endpoints
  const objectMapping: Record<string, string> = {
    'contacts': 'contacts',
    'deals': 'deals',
    'leads': 'leads'
  };

  const zendeskEndpoint = objectMapping[objectType.toLowerCase()] || objectType;
  
  const response = await fetch(`https://api.getbase.com/v2/${zendeskEndpoint}?per_page=${batchSize}&page=${offset}`, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Zendesk Sell API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result.items || [];
}

async function extractMondayData(credential: any, objectType: string, params: ExtractionRequest): Promise<any[]> {
  const apiToken = credential.credential_value;
  const batchSize = params.batchSize || 100;

  // Monday.com uses GraphQL
  const query = `
    query {
      boards(limit: ${batchSize}) {
        id
        name
        items {
          id
          name
          column_values {
            id
            text
            value
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.monday.com/v2', {
    method: 'POST',
    headers: {
      'Authorization': apiToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Monday.com API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  
  // Flatten Monday.com data structure
  const items: any[] = [];
  if (result.data?.boards) {
    for (const board of result.data.boards) {
      for (const item of board.items || []) {
        items.push({
          ...item,
          board_id: board.id,
          board_name: board.name
        });
      }
    }
  }
  
  return items;
}