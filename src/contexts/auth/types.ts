
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
};

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<AuthResponse>;
  signUp: (credentials: SignUpCredentials) => Promise<AuthResponse>;
  signOut: () => Promise<AuthResponse>;
  requestPasswordReset: (email: string) => Promise<AuthResponse>;
  resetPassword: (newPassword: string) => Promise<AuthResponse>;
}
