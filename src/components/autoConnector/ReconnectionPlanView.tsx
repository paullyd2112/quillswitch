
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  ChevronDown, 
  ChevronRight,
  Zap,
  Settings,
  User,
  Target
} from 'lucide-react';
import { ReconnectionStep, DetectedIntegration } from '@/services/autoConnector/autoConnectorService';

interface ReconnectionPlanViewProps {
  plan: ReconnectionStep[];
  integrations: DetectedIntegration[];
}

const ReconnectionPlanView: React.FC<ReconnectionPlanViewProps> = ({
  plan,
  integrations
}) => {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleStepExpansion = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const getStepIcon = (stepType: string) => {
    switch (stepType) {
      case 'automatic': return <Zap className="h-4 w-4 text-green-600" />;
      case 'assisted': return <Settings className="h-4 w-4 text-blue-600" />;
      case 'manual': return <User className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStepBadge = (stepType: string) => {
    switch (stepType) {
      case 'automatic':
        return <Badge className="bg-green-100 text-green-700">Automatic</Badge>;
      case 'assisted':
        return <Badge className="bg-blue-100 text-blue-700">Assisted</Badge>;
      case 'manual':
        return <Badge className="bg-orange-100 text-orange-700">Manual</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getIntegrationDetails = (integrationId: string) => {
    return integrations.find(i => i.id === integrationId);
  };

  const groupedSteps = plan.reduce((acc, step) => {
    if (!acc[step.stepType]) {
      acc[step.stepType] = [];
    }
    acc[step.stepType].push(step);
    return acc;
  }, {} as Record<string, ReconnectionStep[]>);

  const totalEstimatedTime = plan.reduce((acc, step) => acc + step.estimatedTime, 0);

  return (
    <div className="space-y-6">
      {/* Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Reconnection Plan Overview
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{plan.length}</div>
              <div className="text-sm text-muted-foreground">Total Steps</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {groupedSteps.automatic?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Automatic</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {groupedSteps.assisted?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Assisted</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(totalEstimatedTime / 60)}h {totalEstimatedTime % 60}m
              </div>
              <div className="text-sm text-muted-foreground">Est. Time</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Execution Phases</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <div>
                  <div className="font-medium">Auto-Reconnect</div>
                  <div className="text-sm text-muted-foreground">
                    {groupedSteps.automatic?.length || 0} integrations
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <div className="font-medium">Guided Setup</div>
                  <div className="text-sm text-muted-foreground">
                    {groupedSteps.assisted?.length || 0} integrations
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-md">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">3</span>
                </div>
                <div>
                  <div className="font-medium">Manual Setup</div>
                  <div className="text-sm text-muted-foreground">
                    {groupedSteps.manual?.length || 0} integrations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Reconnection Steps</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {plan.map((step, index) => {
              const integration = getIntegrationDetails(step.integrationId);
              const stepId = `${step.integrationId}-${index}`;
              const isExpanded = expandedSteps.has(stepId);
              
              return (
                <Collapsible key={stepId}>
                  <CollapsibleTrigger asChild>
                    <div 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
                      onClick={() => toggleStepExpansion(stepId)}
                    >
                      <div className="flex items-center gap-3">
                        {getStepIcon(step.stepType)}
                        <div>
                          <div className="font-medium">{step.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {integration?.name} • {step.estimatedTime} min
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant="outline" 
                          className={getPriorityColor(step.priority)}
                        >
                          {step.priority}
                        </Badge>
                        {getStepBadge(step.stepType)}
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="pl-7 pr-4 pb-4">
                      <Separator className="mb-4" />
                      
                      {integration && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Integration:</span> {integration.name}
                            </div>
                            <div>
                              <span className="font-medium">Category:</span> {integration.category}
                            </div>
                            <div>
                              <span className="font-medium">Confidence:</span> {Math.round(integration.confidence * 100)}%
                            </div>
                            <div>
                              <span className="font-medium">Credentials:</span> {integration.credentialsNeeded.join(', ')}
                            </div>
                          </div>
                          
                          {step.dependencies.length > 0 && (
                            <div>
                              <span className="font-medium text-sm">Dependencies:</span>
                              <div className="mt-1">
                                {step.dependencies.map((dep, depIndex) => (
                                  <Badge key={depIndex} variant="outline" className="mr-1">
                                    {dep}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            {step.stepType === 'automatic' && (
                              <Button size="sm">
                                <Zap className="h-3 w-3 mr-1" />
                                Execute Now
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReconnectionPlanView;
