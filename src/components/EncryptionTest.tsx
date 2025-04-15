
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Lock, Unlock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EncryptionTest = () => {
  const [originalText, setOriginalText] = useState("Hello, this is a test message to encrypt!");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const { toast } = useToast();

  const handleEncrypt = async () => {
    if (!originalText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to encrypt",
        variant: "destructive"
      });
      return;
    }

    setIsEncrypting(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("encrypt-data", {
        body: {
          action: "encrypt",
          data: originalText
        }
      });
      
      if (error) throw error;
      
      setEncryptedText(data.data);
      setResult({
        success: true,
        message: "Text encrypted successfully!"
      });
    } catch (error: any) {
      console.error("Encryption error:", error);
      setResult({
        success: false,
        message: `Encryption failed: ${error.message || "Unknown error"}`
      });
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedText.trim()) {
      toast({
        title: "Error",
        description: "No encrypted text to decrypt",
        variant: "destructive"
      });
      return;
    }

    setIsDecrypting(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("encrypt-data", {
        body: {
          action: "decrypt",
          data: encryptedText
        }
      });
      
      if (error) throw error;
      
      setDecryptedText(data.data);
      setResult({
        success: true,
        message: "Text decrypted successfully!"
      });
    } catch (error: any) {
      console.error("Decryption error:", error);
      setResult({
        success: false,
        message: `Decryption failed: ${error.message || "Unknown error"}`
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleReset = () => {
    setEncryptedText("");
    setDecryptedText("");
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-lg shadow-md">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Encryption Test Tool</h2>
        <p className="text-muted-foreground mb-4">
          This tool demonstrates the secure encryption and decryption capabilities using the Edge Function.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="original-text" className="block text-sm font-medium mb-1">Original Text</label>
          <textarea 
            id="original-text" 
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm h-24"
            placeholder="Enter text to encrypt"
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleEncrypt} disabled={isEncrypting || !originalText.trim()} className="flex items-center gap-1">
            {isEncrypting ? "Encrypting..." : (
              <>
                <Lock className="h-4 w-4" /> Encrypt
              </>
            )}
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>
        
        {encryptedText && (
          <div>
            <h3 className="text-md font-medium mb-1">Encrypted Result</h3>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-xs break-all max-h-60 overflow-auto">
              {encryptedText}
            </div>
          </div>
        )}
        
        {encryptedText && (
          <div>
            <Button onClick={handleDecrypt} disabled={isDecrypting || !encryptedText} className="flex items-center gap-1">
              {isDecrypting ? "Decrypting..." : (
                <>
                  <Unlock className="h-4 w-4" /> Decrypt
                </>
              )}
            </Button>
          </div>
        )}
        
        {decryptedText && (
          <div>
            <h3 className="text-md font-medium mb-1">Decrypted Result</h3>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-xs break-all max-h-60 overflow-auto">
              {decryptedText}
            </div>
          </div>
        )}
        
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : (
              <XCircle className="h-4 w-4 mr-2" />
            )}
            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>
              {result.message}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default EncryptionTest;
