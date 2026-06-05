import { normalizeBackendUrl } from "@/lib/diagnosis-client";

export type GoogleIntegrationStatus = {
  configured: boolean;
  connected: boolean;
};

export function buildGoogleStatusEndpoint(backendUrl: string) {
  return `${normalizeBackendUrl(backendUrl)}/integrations/google/status`;
}

export function buildGoogleOAuthStartEndpoint(backendUrl: string) {
  return `${normalizeBackendUrl(backendUrl)}/oauth/google/start`;
}

export async function requestGoogleIntegrationStatus(backendUrl: string): Promise<GoogleIntegrationStatus> {
  const response = await fetch(buildGoogleStatusEndpoint(backendUrl), {
    method: "GET",
    cache: "no-store",
    signal: AbortSignal.timeout(2500)
  });

  if (!response.ok) {
    throw new Error("Google integration status request failed.");
  }

  return response.json() as Promise<GoogleIntegrationStatus>;
}
