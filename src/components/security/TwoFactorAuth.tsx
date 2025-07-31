import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, Copy, Download, AlertTriangle, Key } from 'lucide-react';
import { useTwoFactorAuth } from '@/hooks/useTwoFactorAuth';
import { toast } from 'sonner';
import QRCode from 'qrcode';

const TwoFactorAuth: React.FC = () => {
  const {
    settings,
    isLoading,
    loadSettings,
    setupTwoFactor,
    confirmTwoFactor,
    disableTwoFactor,
    regenerateBackupCodes
  } = useTwoFactorAuth();

  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [setupData, setSetupData] = useState<{
    secret: string;
    qrUrl: string;
    backupCodes: string[];
  } | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (setupData?.qrUrl) {
      QRCode.toDataURL(setupData.qrUrl)
        .then(setQrCodeDataUrl)
        .catch(console.error);
    }
  }, [setupData]);

  const handleSetupStart = async () => {
    const data = await setupTwoFactor();
    if (data) {
      setSetupData(data);
      setShowSetupDialog(true);
    }
  };

  const handleSetupConfirm = async () => {
    if (!setupData || !verificationCode) {
      toast.error('Please enter verification code');
      return;
    }

    const success = await confirmTwoFactor(setupData.secret, verificationCode, setupData.backupCodes);
    if (success) {
      setShowSetupDialog(false);
      setSetupData(null);
      setVerificationCode('');
      setBackupCodes(setupData.backupCodes);
      setShowBackupDialog(true);
    }
  };

  const handleDisable = async () => {
    if (!verificationCode) {
      toast.error('Please enter verification code');
      return;
    }

    const success = await disableTwoFactor(verificationCode);
    if (success) {
      setShowDisableDialog(false);
      setVerificationCode('');
    }
  };

  const handleRegenerateBackupCodes = async () => {
    if (!verificationCode) {
      toast.error('Please enter verification code');
      return;
    }

    const newCodes = await regenerateBackupCodes(verificationCode);
    if (newCodes) {
      setBackupCodes(newCodes);
      setShowBackupDialog(true);
      setVerificationCode('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadBackupCodes = () => {
    const content = backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quillswitch-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Backup codes downloaded');
  };

  if (settings === null) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {settings.two_factor_enabled ? (
              <ShieldCheck className="h-6 w-6 text-green-500" />
            ) : (
              <Shield className="h-6 w-6 text-muted-foreground" />
            )}
            <div>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </div>
            <div className="ml-auto">
              <Badge variant={settings.two_factor_enabled ? "default" : "secondary"}>
                {settings.two_factor_enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Two-factor authentication (2FA) adds an extra layer of security by requiring a verification code from your phone in addition to your password.
          </p>

          {settings.two_factor_enabled ? (
            <div className="space-y-4">
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription>
                  Your account is protected with two-factor authentication.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setShowDisableDialog(true)}
                  disabled={isLoading}
                >
                  Disable 2FA
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setVerificationCode('');
                    // Show a simple prompt for regenerating codes
                    const code = prompt('Enter your current 2FA code to regenerate backup codes:');
                    if (code) {
                      setVerificationCode(code);
                      handleRegenerateBackupCodes();
                    }
                  }}
                  disabled={isLoading}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Regenerate Backup Codes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your account is not protected with two-factor authentication. We strongly recommend enabling it.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleSetupStart}
                disabled={isLoading}
              >
                <Shield className="h-4 w-4 mr-2" />
                Enable 2FA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup Dialog */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set up Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan the QR code with your authenticator app, then enter the verification code.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {qrCodeDataUrl && (
              <div className="flex justify-center">
                <img src={qrCodeDataUrl} alt="2FA QR Code" className="w-48 h-48" />
              </div>
            )}

            {setupData && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Manual Entry Key</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={setupData.secret} 
                    readOnly 
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(setupData.secret)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSetupDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetupConfirm} disabled={isLoading || !verificationCode}>
              Confirm & Enable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable Dialog */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Enter your verification code to disable 2FA. This will make your account less secure.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="disable-code">Verification Code</Label>
              <Input
                id="disable-code"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisableDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDisable} 
              disabled={isLoading || !verificationCode}
            >
              Disable 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Backup Codes Dialog */}
      <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Backup Codes</DialogTitle>
            <DialogDescription>
              Save these backup codes in a safe place. You can use them to access your account if you lose your phone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Each backup code can only be used once. Store them securely!
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
              {backupCodes.map((code, index) => (
                <div key={index} className="p-2 bg-muted rounded text-center">
                  {code}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(backupCodes.join('\n'))}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
              <Button 
                variant="outline" 
                onClick={downloadBackupCodes}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowBackupDialog(false)}>
              I've Saved My Codes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TwoFactorAuth;