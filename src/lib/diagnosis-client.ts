export type DiagnosisApiFinding = {
  checkId: string;
  category: string;
  source: string;
  status: "PASS" | "WARN" | "FAIL" | "MANUAL" | "UNAVAILABLE";
  severity: string;
  target: string;
  evidence: Record<string, unknown>;
  recommendation: string;
  limitation: string | null;
};

export type DiagnosisApiResponse = {
  run: {
    id: number;
    overallStatus: DiagnosisApiFinding["status"];
    summary: Record<DiagnosisApiFinding["status"], number>;
  };
  fetch: {
    targetUrl: string;
    finalUrl: string;
    statusCode: number;
    redirects: Array<{ from: string; to: string; statusCode: number }>;
    truncated: boolean;
  };
  findings: DiagnosisApiFinding[];
};

export function normalizeBackendUrl(url: string) {
  return url.replace(/\/+$/, "");
}

export function buildDiagnosisEndpoint(backendUrl: string) {
  return `${normalizeBackendUrl(backendUrl)}/diagnose/url`;
}

export async function requestUrlDiagnosis(backendUrl: string, url: string): Promise<DiagnosisApiResponse> {
  const response = await fetch(buildDiagnosisEndpoint(backendUrl), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url })
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(error?.error ?? "Diagnosis request failed.");
  }

  return response.json() as Promise<DiagnosisApiResponse>;
}
