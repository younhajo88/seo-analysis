import type { GoogleOAuthConfig } from "./google-oauth-config";

export const googleSearchConsoleScope = "https://www.googleapis.com/auth/webmasters.readonly";

export type GoogleToken = {
  accessToken: string;
  expiresAt: number;
};

export type GoogleTokenExchange = (code: string, config: GoogleOAuthConfig) => Promise<GoogleToken>;

export function buildGoogleAuthUrl(config: GoogleOAuthConfig) {
  const url = new URL(config.authUri);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", googleSearchConsoleScope);
  url.searchParams.set("access_type", "online");
  url.searchParams.set("prompt", "consent");
  return url.toString();
}

export async function exchangeGoogleCodeForToken(code: string, config: GoogleOAuthConfig): Promise<GoogleToken> {
  const response = await fetch(config.tokenUri, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code"
    })
  });

  if (!response.ok) {
    throw new Error(`Google token exchange failed with ${response.status}.`);
  }

  const body = (await response.json()) as { access_token?: string; expires_in?: number };

  if (!body.access_token) {
    throw new Error("Google token exchange did not return an access token.");
  }

  return {
    accessToken: body.access_token,
    expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000
  };
}
