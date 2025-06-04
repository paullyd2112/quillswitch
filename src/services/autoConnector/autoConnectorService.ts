
import { supabase } from '@/integrations/supabase/client';
import { SystemConfig } from '@/config/types/connectionTypes';
import { relatedApps } from '@/config/systems';
import { getReconnectionCapability } from '@/utils/reconnectionCapabilityUtils';

export interface DetectedIntegration {
  id: string;
  name: string;
  category: string;
  confidence: number;
  dataFound: string[];
  reconnectionCapability: 'full' | 'partial' | 'basic' | 'manual';
  estimatedSetupTime: number; // in minutes
  credentialsNeeded: string[];
  apiEndpoints?: string[];
  webhookUrls?: string[];
}

export interface AutoConnectorResult {
  totalDetected: number;
  autoReconnectable: number;
  manualSetupRequired: number;
  integrations: DetectedIntegration[];
  reconnectionPlan: ReconnectionStep[];
}

export interface ReconnectionStep {
  integrationId: string;
  stepType: 'automatic' | 'assisted' | 'manual';
  description: string;
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
  dependencies: string[];
}

class AutoConnectorService {
  
  /**
   * Scans CRM data to detect connected integrations
   */
  async detectIntegrations(crmData: any): Promise<DetectedIntegration[]> {
    console.log('🔍 Starting integration detection...');
    
    const detectedIntegrations: DetectedIntegration[] = [];
    
    // Analyze CRM data for integration patterns
    const integrationPatterns = this.analyzeDataPatterns(crmData);
    
    for (const pattern of integrationPatterns) {
      const integration = this.matchPatternToIntegration(pattern);
      if (integration) {
        detectedIntegrations.push(integration);
      }
    }
    
    // Sort by confidence score
    return detectedIntegrations.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Analyzes CRM data for integration patterns
   */
  private analyzeDataPatterns(crmData: any): IntegrationPattern[] {
    const patterns: IntegrationPattern[] = [];
    
    // Email marketing patterns
    if (this.hasEmailMarketingData(crmData)) {
      patterns.push({
        type: 'email-marketing',
        indicators: ['bulk_email_sends', 'campaign_data', 'unsubscribe_lists'],
        confidence: 0.85
      });
    }
    
    // Sales engagement patterns
    if (this.hasSalesEngagementData(crmData)) {
      patterns.push({
        type: 'sales-engagement',
        indicators: ['sequence_data', 'cadence_records', 'outreach_logs'],
        confidence: 0.90
      });
    }
    
    // Support/Helpdesk patterns
    if (this.hasSupportData(crmData)) {
      patterns.push({
        type: 'support',
        indicators: ['ticket_data', 'case_records', 'knowledge_base_links'],
        confidence: 0.88
      });
    }
    
    // Analytics patterns
    if (this.hasAnalyticsData(crmData)) {
      patterns.push({
        type: 'analytics',
        indicators: ['dashboard_configs', 'report_definitions', 'metric_tracking'],
        confidence: 0.75
      });
    }
    
    // Productivity tool patterns
    if (this.hasProductivityData(crmData)) {
      patterns.push({
        type: 'productivity',
        indicators: ['calendar_sync', 'task_management', 'document_sharing'],
        confidence: 0.80
      });
    }
    
    return patterns;
  }

  /**
   * Matches detected patterns to specific integrations
   */
  private matchPatternToIntegration(pattern: IntegrationPattern): DetectedIntegration | null {
    const matchingTools = relatedApps.filter(tool => 
      tool.category === pattern.type || 
      this.isPatternMatch(pattern, tool)
    );
    
    if (matchingTools.length === 0) return null;
    
    // Use the most popular tool for the pattern
    const bestMatch = matchingTools.find(tool => tool.popular) || matchingTools[0];
    
    return {
      id: bestMatch.id,
      name: bestMatch.name,
      category: bestMatch.category,
      confidence: pattern.confidence,
      dataFound: pattern.indicators,
      reconnectionCapability: getReconnectionCapability(bestMatch.id, bestMatch.category),
      estimatedSetupTime: this.calculateSetupTime(bestMatch),
      credentialsNeeded: this.getRequiredCredentials(bestMatch),
      apiEndpoints: this.getApiEndpoints(bestMatch.id),
      webhookUrls: this.getWebhookUrls(bestMatch.id)
    };
  }

  /**
   * Creates a comprehensive reconnection plan
   */
  async createReconnectionPlan(integrations: DetectedIntegration[]): Promise<ReconnectionStep[]> {
    const steps: ReconnectionStep[] = [];
    
    // Sort integrations by priority (high confidence, popular tools first)
    const sortedIntegrations = integrations.sort((a, b) => {
      const aPriority = this.calculatePriority(a);
      const bPriority = this.calculatePriority(b);
      return bPriority - aPriority;
    });
    
    for (const integration of sortedIntegrations) {
      const reconnectionSteps = this.createIntegrationSteps(integration);
      steps.push(...reconnectionSteps);
    }
    
    return steps;
  }

  /**
   * Executes automatic reconnection for supported integrations
   */
  async executeAutoReconnection(integrations: DetectedIntegration[]): Promise<{
    successful: string[];
    failed: { id: string; error: string }[];
    requiresManual: string[];
  }> {
    console.log('🚀 Starting automatic reconnection...');
    
    const successful: string[] = [];
    const failed: { id: string; error: string }[] = [];
    const requiresManual: string[] = [];
    
    const autoReconnectable = integrations.filter(
      i => i.reconnectionCapability === 'full'
    );
    
    for (const integration of autoReconnectable) {
      try {
        const result = await this.attemptAutoReconnection(integration);
        if (result.success) {
          successful.push(integration.id);
        } else {
          failed.push({ id: integration.id, error: result.error });
        }
      } catch (error) {
        failed.push({ 
          id: integration.id, 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // Add integrations that require manual setup
    requiresManual.push(
      ...integrations
        .filter(i => ['partial', 'basic', 'manual'].includes(i.reconnectionCapability))
        .map(i => i.id)
    );
    
    return { successful, failed, requiresManual };
  }

  /**
   * Generates guided setup instructions for manual integrations
   */
  generateSetupInstructions(integration: DetectedIntegration): SetupInstruction[] {
    const instructions: SetupInstruction[] = [];
    
    switch (integration.reconnectionCapability) {
      case 'partial':
        instructions.push(
          {
            step: 1,
            title: 'Verify API Connection',
            description: `Check that ${integration.name} can still access your new CRM`,
            estimatedTime: 2,
            type: 'verification'
          },
          {
            step: 2,
            title: 'Update Field Mappings',
            description: 'Review and update any field mappings that may have changed',
            estimatedTime: 5,
            type: 'configuration'
          }
        );
        break;
        
      case 'basic':
        instructions.push(
          {
            step: 1,
            title: 'Update API Credentials',
            description: `Update ${integration.name} with your new CRM API credentials`,
            estimatedTime: 3,
            type: 'credentials'
          },
          {
            step: 2,
            title: 'Reconfigure Integration Settings',
            description: 'Review and reconfigure integration-specific settings',
            estimatedTime: 8,
            type: 'configuration'
          }
        );
        break;
        
      case 'manual':
        instructions.push(
          {
            step: 1,
            title: 'Complete Setup from Scratch',
            description: `Set up the ${integration.name} integration from the beginning`,
            estimatedTime: 15,
            type: 'full-setup'
          },
          {
            step: 2,
            title: 'Migrate Configuration',
            description: 'Manually recreate your previous integration configuration',
            estimatedTime: 10,
            type: 'configuration'
          }
        );
        break;
    }
    
    return instructions;
  }

  // Helper methods
  private hasEmailMarketingData(data: any): boolean {
    return !!(data.campaigns || data.email_sequences || data.marketing_lists);
  }

  private hasSalesEngagementData(data: any): boolean {
    return !!(data.sequences || data.cadences || data.outreach_activities);
  }

  private hasSupportData(data: any): boolean {
    return !!(data.cases || data.tickets || data.support_interactions);
  }

  private hasAnalyticsData(data: any): boolean {
    return !!(data.dashboards || data.reports || data.custom_metrics);
  }

  private hasProductivityData(data: any): boolean {
    return !!(data.calendar_events || data.tasks || data.documents);
  }

  private isPatternMatch(pattern: IntegrationPattern, tool: SystemConfig): boolean {
    // More sophisticated pattern matching logic could go here
    return false;
  }

  private calculateSetupTime(tool: SystemConfig): number {
    switch (tool.authType) {
      case 'oauth': return 5;
      case 'api': return 8;
      default: return 10;
    }
  }

  private getRequiredCredentials(tool: SystemConfig): string[] {
    switch (tool.authType) {
      case 'oauth': return ['OAuth Authorization'];
      case 'api': return ['API Key', 'API Secret'];
      default: return ['Manual Configuration'];
    }
  }

  private getApiEndpoints(toolId: string): string[] {
    const endpointMap: Record<string, string[]> = {
      'salesforce': ['/services/data/v58.0/', '/services/apexrest/'],
      'hubspot': ['/crm/v3/', '/webhooks/v3/'],
      'marketo': ['/rest/v1/', '/identity/oauth/'],
      'pardot': ['/api/v5/', '/api/v4/'],
      'mailchimp': ['/3.0/lists/', '/3.0/campaigns/'],
      'outreach': ['/api/v2/', '/api/v3/'],
      'salesloft': ['/v2/', '/v1/']
    };
    
    return endpointMap[toolId] || [];
  }

  private getWebhookUrls(toolId: string): string[] {
    // Return common webhook patterns for each tool
    return [`/webhooks/${toolId}`, `/api/webhooks/${toolId}`];
  }

  private calculatePriority(integration: DetectedIntegration): number {
    let priority = integration.confidence;
    
    // Boost priority for popular tools
    if (relatedApps.find(t => t.id === integration.id)?.popular) {
      priority += 0.1;
    }
    
    // Boost priority for easier reconnections
    switch (integration.reconnectionCapability) {
      case 'full': priority += 0.15; break;
      case 'partial': priority += 0.1; break;
      case 'basic': priority += 0.05; break;
      default: break;
    }
    
    return priority;
  }

  private createIntegrationSteps(integration: DetectedIntegration): ReconnectionStep[] {
    const steps: ReconnectionStep[] = [];
    
    if (integration.reconnectionCapability === 'full') {
      steps.push({
        integrationId: integration.id,
        stepType: 'automatic',
        description: `Automatically reconnect ${integration.name}`,
        estimatedTime: 2,
        priority: 'high',
        dependencies: []
      });
    } else {
      steps.push({
        integrationId: integration.id,
        stepType: integration.reconnectionCapability === 'partial' ? 'assisted' : 'manual',
        description: `Manually reconnect ${integration.name}`,
        estimatedTime: integration.estimatedSetupTime,
        priority: integration.confidence > 0.8 ? 'high' : 'medium',
        dependencies: []
      });
    }
    
    return steps;
  }

  private async attemptAutoReconnection(integration: DetectedIntegration): Promise<{
    success: boolean;
    error?: string;
  }> {
    // Simulate auto-reconnection attempt
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, assume some succeed and some fail
    const successRate = integration.confidence;
    const success = Math.random() < successRate;
    
    return {
      success,
      error: success ? undefined : 'Connection timeout - manual setup required'
    };
  }
}

// Supporting interfaces
interface IntegrationPattern {
  type: string;
  indicators: string[];
  confidence: number;
}

interface SetupInstruction {
  step: number;
  title: string;
  description: string;
  estimatedTime: number;
  type: 'verification' | 'credentials' | 'configuration' | 'full-setup';
}

export const autoConnectorService = new AutoConnectorService();
