import type { SeoDatabase } from "../db/connection";
import type { DiagnosisRunInput, FindingStatus, StoredDiagnosisRun } from "../types";

const statuses: FindingStatus[] = ["PASS", "WARN", "FAIL", "MANUAL", "UNAVAILABLE"];

export function createDiagnosisRun(db: SeoDatabase, input: DiagnosisRunInput): StoredDiagnosisRun {
  const now = new Date().toISOString();
  const summary = summarizeFindings(input.findings);

  const transaction = db.transaction(() => {
    const result = db
      .prepare(
        `
          insert into diagnosis_runs (
            target_url,
            final_url,
            started_at,
            completed_at,
            overall_status,
            summary_pass,
            summary_warn,
            summary_fail,
            summary_manual,
            summary_unavailable,
            fetch_json,
            created_at
          )
          values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .run(
        input.targetUrl,
        input.finalUrl,
        now,
        now,
        input.overallStatus,
        summary.PASS,
        summary.WARN,
        summary.FAIL,
        summary.MANUAL,
        summary.UNAVAILABLE,
        JSON.stringify(input.fetch),
        now
      );

    const runId = Number(result.lastInsertRowid);
    const insertFinding = db.prepare(
      `
        insert into diagnosis_findings (
          run_id,
          check_id,
          category,
          source,
          status,
          severity,
          target,
          evidence_json,
          recommendation,
          limitation,
          created_at
        )
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
    );

    for (const finding of input.findings) {
      insertFinding.run(
        runId,
        finding.checkId,
        finding.category,
        finding.source,
        finding.status,
        finding.severity,
        finding.target,
        JSON.stringify(finding.evidence),
        finding.recommendation,
        finding.limitation,
        now
      );
    }

    return { id: runId, summary };
  });

  return transaction();
}

function summarizeFindings(findings: DiagnosisRunInput["findings"]) {
  const summary = Object.fromEntries(statuses.map((status) => [status, 0])) as Record<FindingStatus, number>;

  for (const finding of findings) {
    summary[finding.status] += 1;
  }

  return summary;
}
