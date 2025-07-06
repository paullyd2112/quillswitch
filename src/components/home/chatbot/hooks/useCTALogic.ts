import { useCallback } from 'react';
import { ChatMessage, ConversationContext } from '../types';
import { CTA_OPTIONS } from '../constants';

export const useCTALogic = (conversationContext: ConversationContext) => {
  const shouldShowCTA = useCallback((userInput: string, conversationHistory: ChatMessage[]): boolean => {
    const input = userInput.toLowerCase();
    const userMessageCount = conversationHistory.filter(msg => msg.type === 'user').length;
    
    // Enhanced logic based on conversation context and user journey
    
    // PRIORITY: Explicit expert requests
    const expertRequestIndicators = [
      'talk to a specialist', 'migration specialist', 'talk to someone', 'speak to someone',
      'connect me with', 'talk to a person', 'human help', 'live person', 'expert help',
      'migration expert', 'talk to an expert', 'speak with expert', 'connect with specialist',
      'want to talk', 'need to talk', 'let me talk', 'talk to your team', 'schedule a call'
    ];
    
    if (expertRequestIndicators.some(indicator => input.includes(indicator)) && userMessageCount >= 1) {
      return true;
    }
    
    // Don't show CTAs too early unless user is clearly ready
    if (userMessageCount < 2) return false;
    
    // Context-aware CTA timing based on journey stage
    const { journeyStage, lastSentiment } = conversationContext;
    
    // Show CTAs when user reaches key decision points
    if (journeyStage === 'ready' || journeyStage === 'evaluating') {
      return true;
    }
    
    // High-intent signals
    const readinessIndicators = [
      'ready', 'interested', 'sounds good', 'makes sense', 'convinced', 'sold',
      'let\'s do', 'want to', 'need to', 'should we', 'next step', 'move forward',
      'get started', 'sign up', 'try it', 'demo', 'setup', 'how much', 'pricing'
    ];
    
    // Question/concern indicators (don't show CTAs yet)
    const hesitationIndicators = [
      'what if', 'but what about', 'concerned about', 'worried about', 'issue with',
      'problem with', 'not sure', 'hesitant', 'doubt', 'risk', 'what happens',
      'tell me more', 'how does', 'can you explain'
    ];
    
    const showsReadiness = readinessIndicators.some(indicator => input.includes(indicator));
    const showsHesitation = hesitationIndicators.some(indicator => input.includes(indicator)) ||
                           input.includes('?');
    
    // Smart timing based on conversation flow
    if (showsReadiness && !showsHesitation) return true;
    if (showsHesitation) return false;
    
    // Natural conversation pause detection
    if (lastSentiment === 'positive' && userMessageCount >= 3) return true;
    if (userMessageCount >= 5 && !showsHesitation) return true;
    
    return false;
  }, [conversationContext]);

  const getContextualCTA = useCallback((userInput: string): { message: string; options: string[] } => {
    const input = userInput.toLowerCase();
    const { journeyStage, userDetails, lastSentiment } = conversationContext;
    
    // Intelligent CTA selection based on conversation context
    let ctaMessage: string;
    let ctaOptions: string[];
    
    // Context-aware CTA messaging
    if (input.includes('cost') || input.includes('price') || input.includes('saving') || journeyStage === 'evaluating') {
      ctaMessage = userDetails.companySize === 'small' 
        ? "Want to see exactly how much you could save with your size business?"
        : "Ready to get a custom savings estimate for your specific situation?";
      ctaOptions = CTA_OPTIONS.cost;
    } 
    else if (input.includes('how') || input.includes('process') || input.includes('start') || journeyStage === 'ready') {
      ctaMessage = lastSentiment === 'positive' 
        ? "Sounds like you're ready to make this happen. What's the best next step for you?"
        : "Ready to take the next step?";
      ctaOptions = CTA_OPTIONS.process;
    }
    else if (userDetails.concerns.includes('risk_averse')) {
      ctaMessage = "I get it - migrations can feel risky. Want to talk through your specific concerns with one of our specialists?";
      ctaOptions = ["Talk to a Migration Expert", "Get the Migration Playbook", "See Risk-Free Options"];
    }
    else if (userDetails.concerns.includes('timeline_pressure')) {
      ctaMessage = "Time is crucial for you. Let's see what we can do to fast-track this:";
      ctaOptions = ["Talk to a Migration Expert", "Get Emergency Migration Quote", "See Fastest Options"];
    }
    else {
      // Default contextual message based on journey stage
      const messages = {
        'researching': "What would help you make the best decision?",
        'comparing': "Ready to see how we stack up?",
        'evaluating': "What would be most helpful for your evaluation?",
        'ready': "Looks like you're ready to move forward. What's next?",
        'initial': "What would be most helpful right now?"
      };
      ctaMessage = messages[journeyStage] || messages['initial'];
      ctaOptions = CTA_OPTIONS.general;
    }
    
    return { message: ctaMessage, options: ctaOptions };
  }, [conversationContext]);

  return {
    shouldShowCTA,
    getContextualCTA
  };
};