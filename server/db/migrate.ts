import type { SeoDatabase } from "./connection";

export function migrateDatabase(db: SeoDatabase) {
  db.exec(`
    create table if not exists diagnosis_runs (
      id integer primary key autoincrement,
      target_url text not null,
      final_url text,
      started_at text not null,
      completed_at text not null,
      overall_status text not null,
      summary_pass integer not null default 0,
      summary_warn integer not null default 0,
      summary_fail integer not null default 0,
      summary_manual integer not null default 0,
      summary_unavailable integer not null default 0,
      fetch_json text not null,
      created_at text not null
    );

    create table if not exists diagnosis_findings (
      id integer primary key autoincrement,
      run_id integer not null references diagnosis_runs(id) on delete cascade,
      check_id text not null,
      category text not null,
      source text not null,
      status text not null,
      severity text not null,
      target text not null,
      evidence_json text not null,
      recommendation text not null,
      limitation text,
      created_at text not null
    );
  `);
}
