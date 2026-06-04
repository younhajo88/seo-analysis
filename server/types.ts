export type FindingStatus = "PASS" | "WARN" | "FAIL" | "MANUAL" | "UNAVAILABLE";
export type FindingSeverity = "critical" | "high" | "medium" | "low" | "info";

export type DiagnosisFinding = {
  checkId: string;
  category: string;
  source: "local-crawler" | "gsc" | "system";
  status: FindingStatus;
  severity: FindingSeverity;
  target: string;
  evidence: Record<string, unknown>;
  recommendation: string;
  limitation: string | null;
};

export type DiagnosisRunInput = {
  targetUrl: string;
  finalUrl: string | null;
  overallStatus: FindingStatus;
  fetch: Record<string, unknown>;
  findings: DiagnosisFinding[];
};

export type StoredDiagnosisRun = {
  id: number;
  summary: Record<FindingStatus, number>;
};
