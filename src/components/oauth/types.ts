
export type OAuthStatus = "loading" | "success" | "error";

export interface OAuthState {
  status: OAuthStatus;
  message: string;
  provider: string;
}

export interface OAuthError {
  type: 'oauth_error' | 'missing_params' | 'invalid_state' | 'callback_error' | 'unknown_error';
  message: string;
  description?: string;
}
