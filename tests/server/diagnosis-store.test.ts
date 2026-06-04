import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { openDatabase } from "../../server/db/connection";
import { migrateDatabase } from "../../server/db/migrate";
import { createDiagnosisRun } from "../../server/services/diagnosis-store";

let tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  tempDirs = [];
});

function tempDbPath() {
  const dir = mkdtempSync(join(tmpdir(), "seo-analysis-"));
  tempDirs.push(dir);
  return join(dir, "test.sqlite");
}

describe("diagnosis store", () => {
  it("migrates the initial schema", () => {
    const db = openDatabase(tempDbPath());

    migrateDatabase(db);

    const tables = db
      .prepare("select name from sqlite_master where type = 'table' order by name")
      .all()
      .map((row) => (row as { name: string }).name);

    expect(tables).toContain("diagnosis_runs");
    expect(tables).toContain("diagnosis_findings");

    db.close();
  });

  it("stores a diagnosis run and linked findings", () => {
    const db = openDatabase(tempDbPath());
    migrateDatabase(db);

    const run = createDiagnosisRun(db, {
      targetUrl: "https://example.com/",
      finalUrl: "https://example.com/",
      overallStatus: "PASS",
      fetch: { statusCode: 200, redirects: [] },
      findings: [
        {
          checkId: "reach.http_status",
          category: "reach",
          source: "local-crawler",
          status: "PASS",
          severity: "critical",
          target: "https://example.com/",
          evidence: { statusCode: 200 },
          recommendation: "No action required.",
          limitation: null
        }
      ]
    });

    const runRow = db.prepare("select * from diagnosis_runs where id = ?").get(run.id);
    const findingRows = db.prepare("select * from diagnosis_findings where run_id = ?").all(run.id);

    expect(runRow).toMatchObject({
      target_url: "https://example.com/",
      final_url: "https://example.com/",
      overall_status: "PASS",
      summary_pass: 1,
      summary_fail: 0
    });
    expect(findingRows).toHaveLength(1);
    expect(JSON.parse((findingRows[0] as { evidence_json: string }).evidence_json)).toEqual({ statusCode: 200 });

    db.close();
  });
});
