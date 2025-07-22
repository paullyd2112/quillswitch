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

interface FieldInfo {
  name: string;
  label: string;
  type: string;
  required: boolean;
  length?: number;
  picklistValues?: Array<{ label: string; value: string; active: boolean }>;
  referenceTo?: string[];
  createable?: boolean;
  updateable?: boolean;
}

interface SchemaInfo {
  name: string;
  label: string;
  fields: FieldInfo[];
  createable: boolean;
  updateable: boolean;
  deletable: boolean;
  queryable: boolean;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const crmSystem = pathParts[pathParts.length - 2]; // e.g., 'salesforce'
    const objectType = pathParts[pathParts.length - 1]; // e.g., 'Contact'
    
    const connectionId = req.headers.get('X-Connection-ID');
    if (!connectionId) {
      throw new Error('X-Connection-ID header is required');
    }

    console.log(`Getting schema for ${objectType} from ${crmSystem} for connection ${connectionId}`);

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

    let schemaInfo: SchemaInfo;

    // Route to appropriate CRM schema logic
    switch (crmSystem.toLowerCase()) {
      case 'salesforce':
        schemaInfo = await getSalesforceSchema(credential, objectType);
        break;
      case 'hubspot':
        schemaInfo = await getHubSpotSchema(credential, objectType);
        break;
      case 'dynamics':
        schemaInfo = await getDynamicsSchema(credential, objectType);
        break;
      case 'pipedrive':
        schemaInfo = await getPipedriveSchema(credential, objectType);
        break;
      case 'zendesk-sell':
        schemaInfo = await getZendeskSellSchema(credential, objectType);
        break;
      case 'monday':
        schemaInfo = await getMondaySchema(credential, objectType);
        break;
      default:
        throw new Error(`Unsupported CRM system: ${crmSystem}`);
    }

    console.log(`Retrieved schema for ${objectType} with ${schemaInfo.fields.length} fields`);

    return new Response(
      JSON.stringify({
        success: true,
        fields: schemaInfo.fields,
        schema: schemaInfo,
        metadata: {
          crmSystem,
          objectType,
          fieldCount: schemaInfo.fields.length,
          retrievedAt: new Date().toISOString()
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Schema retrieval error:', error);
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

async function getSalesforceSchema(credential: any, objectType: string): Promise<SchemaInfo> {
  const { access_token, instance_url } = JSON.parse(credential.credential_value);

  const response = await fetch(`${instance_url}/services/data/v57.0/sobjects/${objectType}/describe`, {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Salesforce API error: ${response.status} - ${errorText}`);
  }

  const describe = await response.json();

  return {
    name: describe.name,
    label: describe.label,
    createable: describe.createable,
    updateable: describe.updateable,
    deletable: describe.deletable,
    queryable: describe.queryable,
    fields: describe.fields.map((field: any): FieldInfo => ({
      name: field.name,
      label: field.label,
      type: field.type,
      required: !field.nillable && !field.defaultedOnCreate,
      length: field.length,
      createable: field.createable,
      updateable: field.updateable,
      picklistValues: field.picklistValues || [],
      referenceTo: field.referenceTo || []
    }))
  };
}

async function getHubSpotSchema(credential: any, objectType: string): Promise<SchemaInfo> {
  const { access_token } = JSON.parse(credential.credential_value);

  // Map object types to HubSpot objects
  const objectMapping: Record<string, string> = {
    'contacts': 'contacts',
    'companies': 'companies',
    'deals': 'deals',
    'tickets': 'tickets'
  };

  const hsObjectType = objectMapping[objectType.toLowerCase()] || objectType;

  const response = await fetch(`https://api.hubapi.com/crm/v3/properties/${hsObjectType}`, {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HubSpot API error: ${response.status} - ${errorText}`);
  }

  const properties = await response.json();

  return {
    name: hsObjectType,
    label: hsObjectType.charAt(0).toUpperCase() + hsObjectType.slice(1),
    createable: true,
    updateable: true,
    deletable: true,
    queryable: true,
    fields: properties.results?.map((prop: any): FieldInfo => ({
      name: prop.name,
      label: prop.label,
      type: prop.type,
      required: prop.required || false,
      createable: !prop.readOnlyValue,
      updateable: !prop.readOnlyValue,
      picklistValues: prop.options?.map((opt: any) => ({
        label: opt.label,
        value: opt.value,
        active: true
      })) || []
    })) || []
  };
}

async function getDynamicsSchema(credential: any, objectType: string): Promise<SchemaInfo> {
  const { access_token, instance_url } = JSON.parse(credential.credential_value);

  // Map object types to Dynamics entities
  const objectMapping: Record<string, string> = {
    'contacts': 'contacts',
    'accounts': 'accounts',
    'opportunities': 'opportunities',
    'leads': 'leads'
  };

  const dynamicsEntity = objectMapping[objectType.toLowerCase()] || objectType;

  const response = await fetch(`${instance_url}/api/data/v9.2/EntityDefinitions(LogicalName='${dynamicsEntity}')?$expand=Attributes`, {
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

  const entityDef = await response.json();

  return {
    name: entityDef.LogicalName,
    label: entityDef.DisplayName?.UserLocalizedLabel?.Label || entityDef.LogicalName,
    createable: entityDef.CanCreateAttributes,
    updateable: true,
    deletable: entityDef.CanDelete,
    queryable: true,
    fields: entityDef.Attributes?.map((attr: any): FieldInfo => ({
      name: attr.LogicalName,
      label: attr.DisplayName?.UserLocalizedLabel?.Label || attr.LogicalName,
      type: attr.AttributeTypeName?.Value || 'string',
      required: attr.RequiredLevel?.Value === 'ApplicationRequired',
      createable: attr.IsValidForCreate,
      updateable: attr.IsValidForUpdate,
      length: attr.MaxLength
    })) || []
  };
}

async function getPipedriveSchema(credential: any, objectType: string): Promise<SchemaInfo> {
  const apiToken = credential.credential_value;

  // Map object types to Pipedrive endpoints
  const objectMapping: Record<string, string> = {
    'persons': 'personFields',
    'organizations': 'organizationFields',
    'deals': 'dealFields',
    'activities': 'activityFields'
  };

  const fieldsEndpoint = objectMapping[objectType.toLowerCase()] || 'personFields';

  const response = await fetch(`https://api.pipedrive.com/v1/${fieldsEndpoint}?api_token=${apiToken}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pipedrive API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();

  return {
    name: objectType,
    label: objectType.charAt(0).toUpperCase() + objectType.slice(1),
    createable: true,
    updateable: true,
    deletable: true,
    queryable: true,
    fields: result.data?.map((field: any): FieldInfo => ({
      name: field.key,
      label: field.name,
      type: field.field_type,
      required: field.mandatory_flag || false,
      createable: !field.read_only_flag,
      updateable: !field.read_only_flag,
      picklistValues: field.options?.map((opt: any) => ({
        label: opt.label,
        value: opt.id.toString(),
        active: true
      })) || []
    })) || []
  };
}

async function getZendeskSellSchema(credential: any, objectType: string): Promise<SchemaInfo> {
  // Zendesk Sell has predefined schemas - return common fields
  const commonSchemas: Record<string, SchemaInfo> = {
    'contacts': {
      name: 'Contact',
      label: 'Contact',
      createable: true,
      updateable: true,
      deletable: true,
      queryable: true,
      fields: [
        { name: 'id', label: 'ID', type: 'id', required: false, createable: false, updateable: false },
        { name: 'first_name', label: 'First Name', type: 'string', required: false, createable: true, updateable: true },
        { name: 'last_name', label: 'Last Name', type: 'string', required: true, createable: true, updateable: true },
        { name: 'email', label: 'Email', type: 'email', required: false, createable: true, updateable: true },
        { name: 'phone', label: 'Phone', type: 'phone', required: false, createable: true, updateable: true },
        { name: 'mobile', label: 'Mobile', type: 'phone', required: false, createable: true, updateable: true },
        { name: 'title', label: 'Title', type: 'string', required: false, createable: true, updateable: true },
        { name: 'description', label: 'Description', type: 'textarea', required: false, createable: true, updateable: true }
      ]
    },
    'deals': {
      name: 'Deal',
      label: 'Deal',
      createable: true,
      updateable: true,
      deletable: true,
      queryable: true,
      fields: [
        { name: 'id', label: 'ID', type: 'id', required: false, createable: false, updateable: false },
        { name: 'name', label: 'Name', type: 'string', required: true, createable: true, updateable: true },
        { name: 'value', label: 'Value', type: 'currency', required: false, createable: true, updateable: true },
        { name: 'currency', label: 'Currency', type: 'string', required: false, createable: true, updateable: true },
        { name: 'hot', label: 'Hot', type: 'boolean', required: false, createable: true, updateable: true },
        { name: 'stage_id', label: 'Stage ID', type: 'reference', required: false, createable: true, updateable: true }
      ]
    }
  };

  return commonSchemas[objectType.toLowerCase()] || {
    name: objectType,
    label: objectType,
    createable: true,
    updateable: true,
    deletable: true,
    queryable: true,
    fields: []
  };
}

async function getMondaySchema(credential: any, objectType: string): Promise<SchemaInfo> {
  const apiToken = credential.credential_value;

  // Get board structure from Monday.com
  const query = `
    query {
      boards(limit: 1) {
        id
        name
        columns {
          id
          title
          type
          settings_str
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
  const board = result.data?.boards?.[0];

  if (!board) {
    throw new Error('No boards found in Monday.com workspace');
  }

  return {
    name: 'Item',
    label: 'Board Item',
    createable: true,
    updateable: true,
    deletable: true,
    queryable: true,
    fields: [
      { name: 'id', label: 'ID', type: 'id', required: false, createable: false, updateable: false },
      { name: 'name', label: 'Name', type: 'string', required: true, createable: true, updateable: true },
      ...(board.columns?.map((col: any): FieldInfo => ({
        name: col.id,
        label: col.title,
        type: col.type,
        required: false,
        createable: true,
        updateable: true
      })) || [])
    ]
  };
}