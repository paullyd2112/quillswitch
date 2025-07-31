/**
 * Centralized environment configuration for QuillSwitch
 * Provides secure access to configuration values with proper validation
 */

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

interface AppConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  supabase: SupabaseConfig;
  appUrl: string;
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): AppConfig {
    const isDevelopment = import.meta.env.DEV;
    const isProduction = import.meta.env.PROD;

    // These values are safe to be public as they're designed for client-side use
    // Supabase anon keys are specifically designed to be exposed in client-side code
    const supabaseUrl = "https://kxjidapjtcxwzpwdomnm.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4amlkYXBqdGN4d3pwd2RvbW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NjUzNzUsImV4cCI6MjA1ODU0MTM3NX0.U1kLjAztYB-Jfye3dIkJ7gx9U7aNDYHrorkI1Bax_g8";

    return {
      isDevelopment,
      isProduction,
      supabase: {
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
      },
      appUrl: isProduction ? 'https://quillswitch.com' : window.location.origin,
    };
  }

  private validateConfig(): void {
    const { supabase } = this.config;
    
    if (!supabase.url || !supabase.url.startsWith('https://')) {
      throw new Error('Invalid Supabase URL configuration');
    }

    if (!supabase.anonKey || supabase.anonKey.length < 100) {
      throw new Error('Invalid Supabase anon key configuration');
    }

    // Additional validation for production
    if (this.config.isProduction) {
      if (supabase.url.includes('localhost') || supabase.url.includes('127.0.0.1')) {
        throw new Error('Production build cannot use localhost URLs');
      }
    }
  }

  public getConfig(): Readonly<AppConfig> {
    return Object.freeze({ ...this.config });
  }

  public getSupabaseConfig(): Readonly<SupabaseConfig> {
    return Object.freeze({ ...this.config.supabase });
  }

  public isDevelopment(): boolean {
    return this.config.isDevelopment;
  }

  public isProduction(): boolean {
    return this.config.isProduction;
  }

  public getAppUrl(): string {
    return this.config.appUrl;
  }
}

// Export singleton instance and convenience functions
export const configManager = ConfigManager.getInstance();
export const getSupabaseConfig = () => configManager.getSupabaseConfig();
export const isDev = () => configManager.isDevelopment();
export const isProd = () => configManager.isProduction();