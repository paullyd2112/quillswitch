
import { Session, User, AuthError } from '@supabase/supabase-js';

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = SignInCredentials & {
  metadata?: { [key: string]: any };
};

export type AuthResponse<T = any> = {
  data?: T;
  error: AuthError | Error | null;
  emailConfirmationSent?: boolean;
};

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<AuthResponse>;
  signOut: () => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<AuthResponse>;
  requestPasswordReset: (email: string) => Promise<AuthResponse>;
  resetPassword: (newPassword: string) => Promise<AuthResponse>;
}
