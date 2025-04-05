
// Define types for user-related data from Supabase
import { User } from "@supabase/supabase-js";

export interface UserNotificationPreferences {
  id: string;
  user_id: string;
  status_changes: boolean;
  errors: boolean;
  completions: boolean;
  data_validation: boolean;
  mapping_changes: boolean;
  email_delivery: boolean;
  in_app_delivery: boolean;
  sms_delivery: boolean;
  email_address: string | null;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
