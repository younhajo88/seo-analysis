import { describe, expect, it } from "vitest";
import { buildDiagnosisEndpoint, normalizeBackendUrl } from "../src/lib/diagnosis-client";

describe("diagnosis client", () => {
  it("normalizes backend URLs before building diagnosis endpoints", () => {
    expect(normalizeBackendUrl("http://localhost:4317/")).toBe("http://localhost:4317");
    expect(buildDiagnosisEndpoint("http://localhost:4317/")).toBe("http://localhost:4317/diagnose/url");
  });
});
