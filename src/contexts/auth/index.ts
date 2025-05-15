
export * from "./AuthProvider";
export * from "./types";
export * from "./useAuthState";

// Create and export the useAuth hook
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { AuthContextType } from './types';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
