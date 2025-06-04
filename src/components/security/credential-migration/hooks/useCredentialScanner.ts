
export const useCredentialScanner = () => {
  const scanForCredentials = (): string[] => {
    const credentials: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('api_key') || 
        key.includes('credential') || 
        key.includes('token') ||
        key.includes('secret')
      )) {
        // Skip legitimate auth tokens
        if (key.includes('auth-token') || key.includes('supabase')) continue;
        credentials.push(key);
      }
    }
    
    return credentials;
  };

  return { scanForCredentials };
};
