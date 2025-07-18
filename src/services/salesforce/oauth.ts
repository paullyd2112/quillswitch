import { SalesforceOAuthConfig, SalesforceTokenResponse } from './types';

export class SalesforceOAuthService {
  private config: SalesforceOAuthConfig;
  private baseUrl: string;

  constructor(config: SalesforceOAuthConfig, sandbox = false) {
    this.config = config;
    this.baseUrl = sandbox ? 'https://test.salesforce.com' : 'https://login.salesforce.com';
  }

  generateAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      state: state || ''
    });

    return `${this.baseUrl}/services/oauth2/authorize?${params.toString()}`;
  }

  generatePKCEAuthUrl(codeChallenge: string, state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state: state || ''
    });

    return `${this.baseUrl}/services/oauth2/authorize?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string, clientSecret: string, codeVerifier?: string): Promise<SalesforceTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.config.clientId,
      client_secret: clientSecret,
      redirect_uri: this.config.redirectUri,
      code: code
    });

    if (codeVerifier) {
      params.append('code_verifier', codeVerifier);
    }

    const response = await fetch(`${this.baseUrl}/services/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OAuth token exchange failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async refreshAccessToken(refreshToken: string, clientSecret: string): Promise<SalesforceTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.config.clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
    });

    const response = await fetch(`${this.baseUrl}/services/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token refresh failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async revokeToken(token: string): Promise<void> {
    const params = new URLSearchParams({
      token: token
    });

    const response = await fetch(`${this.baseUrl}/services/oauth2/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error(`Token revocation failed: ${response.status} ${response.statusText}`);
    }
  }
}

// Utility functions for PKCE
export const generateCodeVerifier = (): string => {
  const array = new Uint32Array(56);
  crypto.getRandomValues(array);
  return Array.from(array, (dec) => ('0' + dec.toString(16)).substr(-2)).join('');
};

export const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};