import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DemoAccessInfo {
  canAccess: boolean;
  demoType: 'basic' | 'real_data' | 'premium';
  recordLimit: number;
  reason: string;
  remainingDemos?: number;
}

export interface DemoSession {
  id: string;
  sessionToken: string;
  demoType: string;
  dataSourceType: 'native_crm' | 'manual_api' | 'csv_upload';
  recordCount: number;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  expiresAt: string;
}

export const useDemoAccess = () => {
  const { toast } = useToast();
  const [accessInfo, setAccessInfo] = useState<DemoAccessInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<DemoSession | null>(null);

  const checkDemoAccess = async (email: string): Promise<DemoAccessInfo | null> => {
    if (!email) return null;

    setIsLoading(true);
    try {
      const emailDomain = email.split('@')[1];
      
      const { data, error } = await supabase.rpc('check_demo_access', {
        p_email_domain: emailDomain
      });

      if (error) throw error;

      const responseData = (data[0] || {}) as any;
      const accessInfo: DemoAccessInfo = {
        canAccess: responseData.can_access || false,
        demoType: (responseData.demo_type as 'basic' | 'real_data' | 'premium') || 'basic',
        recordLimit: responseData.record_limit || 100,
        reason: responseData.reason || 'Unknown',
        remainingDemos: responseData.demo_type === 'real_data' ? Math.max(0, 3 - (responseData.demo_count || 0)) : undefined
      };

      setAccessInfo(accessInfo);
      return accessInfo;
    } catch (error) {
      console.error('Error checking demo access:', error);
      toast({
        title: "Access Check Failed",
        description: "Unable to verify demo access. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createDemoSession = async (
    demoType: string,
    dataSourceType: 'native_crm' | 'manual_api' | 'csv_upload',
    sourceConnectionId?: string,
    destinationConnectionId?: string
  ): Promise<DemoSession | null> => {
    setIsLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.email) throw new Error('User not authenticated');

      // Update demo access record
      const emailDomain = user.user.email.split('@')[1];
      await supabase.rpc('update_demo_access', {
        p_email_domain: emailDomain,
        p_demo_type: demoType,
        p_data_record_limit: accessInfo?.recordLimit || 100
      });

      // Create demo session
      const { data, error } = await supabase
        .from('demo_sessions')
        .insert({
          user_id: user.user.id,
          demo_type: demoType,
          source_connection_id: sourceConnectionId,
          destination_connection_id: destinationConnectionId,
          data_source_type: dataSourceType,
          processing_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      const session: DemoSession = {
        id: data.id,
        sessionToken: data.session_token,
        demoType: data.demo_type,
        dataSourceType: data.data_source_type as 'native_crm' | 'manual_api' | 'csv_upload',
        recordCount: data.record_count,
        processingStatus: data.processing_status as 'pending' | 'processing' | 'completed' | 'failed',
        expiresAt: data.expires_at
      };

      setCurrentSession(session);
      return session;
    } catch (error) {
      console.error('Error creating demo session:', error);
      toast({
        title: "Session Creation Failed",
        description: "Unable to create demo session. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId: string, status: string, recordCount?: number) => {
    try {
      const updateData: any = { processing_status: status };
      if (recordCount !== undefined) {
        updateData.record_count = recordCount;
      }

      const { error } = await supabase
        .from('demo_sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (error) throw error;

      if (currentSession && currentSession.id === sessionId) {
        setCurrentSession({
          ...currentSession,
          processingStatus: status as any,
          recordCount: recordCount || currentSession.recordCount
        });
      }
    } catch (error) {
      console.error('Error updating session status:', error);
    }
  };

  const getCurrentUserEmail = async (): Promise<string | null> => {
    const { data: user } = await supabase.auth.getUser();
    return user.user?.email || null;
  };

  return {
    accessInfo,
    currentSession,
    isLoading,
    checkDemoAccess,
    createDemoSession,
    updateSessionStatus,
    getCurrentUserEmail
  };
};