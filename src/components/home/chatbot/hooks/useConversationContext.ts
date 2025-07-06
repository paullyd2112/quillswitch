import { useState, useCallback } from 'react';
import { ConversationContext } from '../types';

export const useConversationContext = () => {
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    userDetails: {
      currentCRM: null,
      targetCRM: null,
      companySize: null,
      recordCount: null,
      industry: null,
      timeline: null,
      concerns: [],
      interests: []
    },
    journeyStage: 'initial',
    conversationTone: 'neutral',
    previousTopics: [],
    lastSentiment: 'neutral'
  });

  const updateConversationContext = useCallback((userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    setConversationContext(prev => {
      const updated = { ...prev };
      
      // Detect CRM mentions
      const crmKeywords = {
        'salesforce': 'Salesforce',
        'hubspot': 'HubSpot', 
        'pipedrive': 'Pipedrive',
        'zoho': 'Zoho',
        'dynamics': 'Microsoft Dynamics',
        'sugar': 'Sugar CRM'
      };
      
      Object.entries(crmKeywords).forEach(([keyword, name]) => {
        if (message.includes(keyword)) {
          if (message.includes('from') || message.includes('current')) {
            updated.userDetails.currentCRM = name;
          } else if (message.includes('to') || message.includes('switch')) {
            updated.userDetails.targetCRM = name;
          }
        }
      });
      
      // Detect company size indicators
      if (message.includes('small business') || message.includes('startup')) {
        updated.userDetails.companySize = 'small';
      } else if (message.includes('enterprise') || message.includes('large company')) {
        updated.userDetails.companySize = 'enterprise';
      } else if (message.includes('medium') || message.includes('mid-size')) {
        updated.userDetails.companySize = 'medium';
      }
      
      // Detect concerns
      const concernKeywords = ['worried', 'concerned', 'scared', 'risk', 'afraid', 'problem', 'issue', 'fail'];
      if (concernKeywords.some(word => message.includes(word))) {
        updated.lastSentiment = 'frustrated';
        if (!updated.userDetails.concerns.includes('risk_averse')) {
          updated.userDetails.concerns.push('risk_averse');
        }
      }
      
      // Detect positive sentiment
      const positiveKeywords = ['excited', 'great', 'awesome', 'perfect', 'exactly', 'love'];
      if (positiveKeywords.some(word => message.includes(word))) {
        updated.lastSentiment = 'positive';
      }
      
      // Detect urgency
      if (message.includes('urgent') || message.includes('quickly') || message.includes('asap')) {
        if (!updated.userDetails.concerns.includes('timeline_pressure')) {
          updated.userDetails.concerns.push('timeline_pressure');
        }
      }
      
      // Update journey stage
      if (message.includes('price') || message.includes('cost') || message.includes('budget')) {
        updated.journeyStage = 'evaluating';
      } else if (message.includes('ready') || message.includes('start') || message.includes('begin')) {
        updated.journeyStage = 'ready';
      } else if (message.includes('compare') || message.includes('vs') || message.includes('difference')) {
        updated.journeyStage = 'comparing';
      }
      
      return updated;
    });
  }, []);

  return {
    conversationContext,
    updateConversationContext
  };
};