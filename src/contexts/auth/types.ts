
import { Session, User } from "@supabase/supabase-js";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (data: { email: string; password: string }) => Promise<{ error: Error | null }>;
  signUp: (data: { email: string; password: string; metadata?: any }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}
