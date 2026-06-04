import { dirname } from "node:path";
import { mkdirSync } from "node:fs";
import Database from "better-sqlite3";

export type SeoDatabase = Database.Database;

export function openDatabase(path: string) {
  mkdirSync(dirname(path), { recursive: true });
  return new Database(path);
}
