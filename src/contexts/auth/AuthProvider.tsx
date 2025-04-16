
import React, { createContext, useContext } from "react";
import { useAuthState } from "./useAuthState";
import { signIn, signUp, signOut, resetPassword } from "./authMethods";
import { AuthContextType } from "./types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, user, isLoading, setIsLoading } = useAuthState();

  const authContextValue: AuthContextType = {
    session,
    user,
    isLoading,
    signIn: (email: string, password: string) => signIn(email, password),
    signUp: (email: string, password: string) => signUp(email, password),
    signOut: () => signOut(setIsLoading),
    resetPassword: (email: string) => resetPassword(email, setIsLoading),
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
