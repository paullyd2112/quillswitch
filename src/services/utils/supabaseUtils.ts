
import { supabase } from "@/integrations/supabase/client";

/**
 * Helper function to perform operations on tables that might not be 
 * properly typed in the Supabase client yet
 */
export const safeTable = <T = any>(table: string) => {
  // Use type assertion to tell TypeScript to trust us about the table name
  return supabase.from(table as any) as any;
};
