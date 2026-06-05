import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { loadGoogleOAuthConfigFromFile, type GoogleOAuthConfig } from "./services/google-oauth-config";

export const serverVersion = "0.1.0";
export const defaultPort = 4317;

export const defaultAllowedOrigins = [
  "https://seo-analysis-two.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

export type ServerConfig = {
  port: number;
  allowedOrigins: string[];
  googleOAuth: GoogleOAuthConfig | null;
  pageSpeedApiKey: string | null;
};

export function loadServerConfig(): ServerConfig {
  const extraOrigins = (process.env.SEO_ANALYSIS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    port: Number(process.env.SEO_ANALYSIS_PORT ?? defaultPort),
    allowedOrigins: [...defaultAllowedOrigins, ...extraOrigins],
    googleOAuth: loadGoogleOAuthConfig(),
    pageSpeedApiKey: process.env.PAGESPEED_API_KEY ?? null
  };
}

function loadGoogleOAuthConfig() {
  const explicitPath = process.env.GOOGLE_OAUTH_CLIENT_SECRET_FILE;
  const path = explicitPath ?? findClientSecretFile(process.cwd());

  if (!path) {
    return null;
  }

  return loadGoogleOAuthConfigFromFile(path);
}

function findClientSecretFile(root: string) {
  if (!existsSync(root)) {
    return null;
  }

  return readdirSync(root)
    .filter((name) => /^client_secret_.*\.json$/.test(name))
    .sort()
    .map((name) => join(root, name))[0] ?? null;
}
