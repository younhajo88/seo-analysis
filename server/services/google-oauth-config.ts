import { readFileSync } from "node:fs";

export type GoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
  authUri: string;
  tokenUri: string;
  redirectUri: string;
};

type GoogleClientSecretFile = {
  web?: {
    client_id?: string;
    client_secret?: string;
    auth_uri?: string;
    token_uri?: string;
    redirect_uris?: string[];
  };
};

export function loadGoogleOAuthConfigFromFile(path: string): GoogleOAuthConfig {
  const parsed = JSON.parse(readFileSync(path, "utf8")) as GoogleClientSecretFile;
  const web = parsed.web;

  if (!web?.client_id || !web.client_secret || !web.auth_uri || !web.token_uri || !web.redirect_uris?.[0]) {
    throw new Error("Google OAuth client secret JSON must contain a web client with a redirect URI.");
  }

  return {
    clientId: web.client_id,
    clientSecret: web.client_secret,
    authUri: web.auth_uri,
    tokenUri: web.token_uri,
    redirectUri: web.redirect_uris[0]
  };
}
