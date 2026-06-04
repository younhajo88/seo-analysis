import { describe, expect, it } from "vitest";
import {
  backendStatusCopy,
  canRunDiagnosis,
  defaultBackendUrl
} from "../src/lib/backend-status";

describe("backend diagnosis gate", () => {
  it("disables diagnosis when the local backend is disconnected", () => {
    expect(canRunDiagnosis("disconnected")).toBe(false);
    expect(backendStatusCopy.disconnected.actionLabel).toBe("로컬 진단 서버 연결 필요");
  });

  it("only enables diagnosis after the local backend is connected", () => {
    expect(canRunDiagnosis("checking")).toBe(false);
    expect(canRunDiagnosis("misconfigured")).toBe(false);
    expect(canRunDiagnosis("error")).toBe(false);
    expect(canRunDiagnosis("connected")).toBe(true);
  });

  it("uses a local default backend url", () => {
    expect(defaultBackendUrl).toBe("http://localhost:4317");
  });
});
