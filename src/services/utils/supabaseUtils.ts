
import { supabase } from "@/integrations/supabase/client";
import { PostgrestFilterBuilder, PostgrestQueryBuilder } from "@supabase/supabase-js";

/**
 * Helper function to perform operations on tables that might not be 
 * properly typed in the Supabase client yet
 */
export const safeTable = <T = any>(table: string) => {
  return supabase.from(table) as unknown as PostgrestQueryBuilder<any, any, T>;
};
