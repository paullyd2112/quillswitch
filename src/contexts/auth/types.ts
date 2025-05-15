
export type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at?: string;
  company?: string;
  role?: string;
} | null;

export type AuthError = {
  message: string;
  code?: string;
} | null;

export type AuthContextType = {
  user: User;
  loading: boolean;
  error: AuthError;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  isAuthenticated: boolean;
};
