export interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'options';
  content: string;
  options?: string[];
  timestamp?: Date;
  sentiment?: 'positive' | 'negative' | 'neutral' | 'frustrated' | 'excited';
  intent?: 'research' | 'compare' | 'pricing' | 'technical' | 'ready' | 'concerned';
}

export interface UserDetails {
  currentCRM: string | null;
  targetCRM: string | null;
  companySize: string | null;
  recordCount: string | null;
  industry: string | null;
  timeline: string | null;
  concerns: string[];
  interests: string[];
}

export interface ConversationContext {
  userDetails: UserDetails;
  journeyStage: 'initial' | 'researching' | 'comparing' | 'evaluating' | 'ready' | 'concerned';
  conversationTone: 'formal' | 'casual' | 'neutral';
  previousTopics: string[];
  lastSentiment: 'positive' | 'negative' | 'neutral' | 'frustrated' | 'excited';
}

export interface CTAOptions {
  cost: string[];
  process: string[];
  general: string[];
}