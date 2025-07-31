import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { generateTOTPSecret, generateTOTPUrl, generateBackupCodes, verifyTOTPCode } from '@/utils/totp';
import { authLog } from '@/utils/logging/consoleReplacer';

interface TwoFactorSettings {
  two_factor_enabled: boolean;
  has_backup_codes: boolean;
}

export const useTwoFactorAuth = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<TwoFactorSettings | null>(null);

  const loadSettings = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_security_settings')
        .select('two_factor_enabled, backup_codes')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        authLog.error('Failed to load 2FA settings', error);
        return;
      }

      setSettings({
        two_factor_enabled: data?.two_factor_enabled || false,
        has_backup_codes: data?.backup_codes ? data.backup_codes.length > 0 : false
      });
    } catch (error) {
      authLog.error('Error loading 2FA settings', error);
    }
  }, [user]);

  const setupTwoFactor = useCallback(async () => {
    if (!user?.email) {
      toast.error('User email not available');
      return null;
    }

    setIsLoading(true);
    try {
      const secret = generateTOTPSecret();
      const qrUrl = generateTOTPUrl(secret, user.email);
      const backupCodes = generateBackupCodes();

      authLog.info('2FA setup initiated', { userId: user.id });

      return {
        secret,
        qrUrl,
        backupCodes
      };
    } catch (error) {
      authLog.error('Failed to setup 2FA', error);
      toast.error('Failed to setup 2FA');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const confirmTwoFactor = useCallback(async (secret: string, code: string, backupCodes: string[]) => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    setIsLoading(true);
    try {
      // Verify the TOTP code first
      const isValid = await verifyTOTPCode(secret, code);
      if (!isValid) {
        toast.error('Invalid verification code');
        return false;
      }

      // Store encrypted settings in database
      const { data, error } = await supabase.functions.invoke('store-2fa-secret', {
        body: {
          secret,
          code,
          backupCodes
        }
      });

      if (error) {
        authLog.error('Failed to store 2FA secret', error);
        toast.error('Failed to enable 2FA');
        return false;
      }

      if (!data?.success) {
        toast.error(data?.error || 'Failed to enable 2FA');
        return false;
      }

      authLog.info('2FA enabled successfully', { userId: user.id });
      toast.success('Two-factor authentication enabled!');
      await loadSettings();
      return true;
    } catch (error) {
      authLog.error('Error confirming 2FA', error);
      toast.error('Failed to enable 2FA');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, loadSettings]);

  const disableTwoFactor = useCallback(async (verificationCode: string) => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-and-disable-2fa', {
        body: {
          verificationCode
        }
      });

      if (error) {
        authLog.error('Error disabling 2FA:', error);
        toast.error('Failed to disable 2FA');
        return false;
      }

      if (!data?.success) {
        toast.error(data?.error || 'Invalid verification code');
        return false;
      }

      authLog.info('2FA disabled', { userId: user.id });
      toast.success('Two-factor authentication disabled');
      await loadSettings();
      return true;
    } catch (error) {
      authLog.error('Error disabling 2FA', error);
      toast.error('Failed to disable 2FA');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, loadSettings]);

  const regenerateBackupCodes = useCallback(async (verificationCode: string) => {
    if (!user) {
      toast.error('User not authenticated');
      return null;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('regenerate-backup-codes', {
        body: {
          verificationCode
        }
      });

      if (error) {
        authLog.error('Error regenerating backup codes:', error);
        toast.error('Failed to regenerate backup codes');
        return null;
      }

      if (!data?.success) {
        toast.error(data?.error || 'Invalid verification code');
        return null;
      }

      authLog.info('Backup codes regenerated', { userId: user.id });
      toast.success('Backup codes regenerated');
      await loadSettings();
      return data.backupCodes;
    } catch (error) {
      authLog.error('Error regenerating backup codes', error);
      toast.error('Failed to regenerate backup codes');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, loadSettings]);

  return {
    settings,
    isLoading,
    loadSettings,
    setupTwoFactor,
    confirmTwoFactor,
    disableTwoFactor,
    regenerateBackupCodes
  };
};