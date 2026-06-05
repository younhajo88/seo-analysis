"use client";

import { FormEvent, useEffect, useState } from "react";
import { Cable, CircleCheck, CircleOff, RefreshCw, Search, ServerCrash } from "lucide-react";
import { backendStatusCopy, canRunDiagnosis, defaultBackendUrl, type BackendStatus } from "@/lib/backend-status";
import {
  getCategoryLabel,
  getFindingCopy,
  getSeverityLabel,
  getStatusCopy,
  summarizeEvidence,
  translateLimitation,
  type DiagnosisApiFinding
} from "@/lib/diagnosis-copy";
import { requestUrlDiagnosis, type DiagnosisApiResponse } from "@/lib/diagnosis-client";

export function BackendStatusPanel() {
  const [status, setStatus] = useState<BackendStatus>("checking");
  const [backendUrl, setBackendUrl] = useState(defaultBackendUrl);
  const [targetUrl, setTargetUrl] = useState("https://seo-analysis-two.vercel.app/");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<DiagnosisApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function resolveBackendStatus(url = backendUrl) {
    try {
      const response = await fetch(`${url.replace(/\/$/, "")}/health`, {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(2500)
      });

      if (!response.ok) {
        return "error";
      }

      const data = (await response.json()) as { ok?: boolean; version?: string };
      return data.ok && data.version ? "connected" : "misconfigured";
    } catch {
      return "disconnected";
    }
  }

  async function checkBackend(url = backendUrl) {
    setStatus("checking");
    setStatus(await resolveBackendStatus(url));
  }

  async function runDiagnosis(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canRunDiagnosis(status)) {
      return;
    }

    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      setResult(await requestUrlDiagnosis(backendUrl, targetUrl));
    } catch (diagnosisError) {
      setError(diagnosisError instanceof Error ? diagnosisError.message : "진단 요청에 실패했습니다.");
    } finally {
      setIsRunning(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void resolveBackendStatus().then(setStatus);
    }, 0);

    return () => window.clearTimeout(timer);
    // Run once after mount. Manual retries use the button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = backendStatusCopy[status];
  const enabled = canRunDiagnosis(status);

  return (
    <section className="diagnosis-panel" aria-labelledby="backend-status-title">
      <div className="panel-heading">
        <span className={`status-icon status-${status}`} aria-hidden="true">
          {enabled ? <CircleCheck size={20} /> : <CircleOff size={20} />}
        </span>
        <div>
          <p className="eyebrow">Local server status</p>
          <h2 id="backend-status-title">{copy.title}</h2>
        </div>
      </div>
      <p>{copy.description}</p>

      <form onSubmit={runDiagnosis}>
        <label className="field">
          <span>로컬 진단 서버 주소</span>
          <input
            value={backendUrl}
            onChange={(event) => setBackendUrl(event.target.value)}
            placeholder={defaultBackendUrl}
          />
        </label>

        <label className="field">
          <span>진단할 URL</span>
          <input
            value={targetUrl}
            onChange={(event) => setTargetUrl(event.target.value)}
            placeholder="https://example.com/"
            disabled={!enabled || isRunning}
          />
        </label>

        <div className="diagnosis-actions">
          <button type="button" className="secondary-button" onClick={() => void checkBackend()} disabled={isRunning}>
            <RefreshCw size={16} />
            연결 다시 확인
          </button>
          <button type="submit" className="primary-button" disabled={!enabled || isRunning}>
            {isRunning ? <RefreshCw size={16} /> : <Cable size={16} />}
            {isRunning ? "진단 중" : copy.actionLabel}
          </button>
        </div>
      </form>

      {!enabled ? (
        <div className="disabled-note">
          <strong>진단은 아직 실행할 수 없습니다.</strong>
          <span>
            공개 페이지는 검색엔진이 읽을 수 있지만 URL 크롤링과 Search Console 조회는 로컬 백엔드가 연결된 뒤에만
            시작됩니다.
          </span>
        </div>
      ) : null}

      {error ? (
        <div className="diagnosis-error" role="alert">
          <ServerCrash size={18} />
          <span>{error}</span>
        </div>
      ) : null}

      {result ? <DiagnosisResult result={result} /> : null}
    </section>
  );
}

function DiagnosisResult({ result }: { result: DiagnosisApiResponse }) {
  const overall = getStatusCopy(result.run.overallStatus);

  return (
    <div className="diagnosis-result" aria-live="polite">
      <div className="result-heading">
        <Search size={18} />
        <div>
          <strong>진단 결과 #{result.run.id}</strong>
          <span>
            최종 상태: {overall.label} · {overall.description}
          </span>
        </div>
      </div>

      <dl className="result-summary">
        <div>
          <dt>HTTP</dt>
          <dd>{result.fetch.statusCode}</dd>
        </div>
        <div>
          <dt>통과</dt>
          <dd>{result.run.summary.PASS}</dd>
        </div>
        <div>
          <dt>주의</dt>
          <dd>{result.run.summary.WARN}</dd>
        </div>
        <div>
          <dt>실패</dt>
          <dd>{result.run.summary.FAIL}</dd>
        </div>
        <div>
          <dt>수동 확인</dt>
          <dd>{result.run.summary.MANUAL}</dd>
        </div>
        <div>
          <dt>진단 불가</dt>
          <dd>{result.run.summary.UNAVAILABLE}</dd>
        </div>
      </dl>

      <div className="redirect-detail">
        <strong>최종 URL</strong>
        <span>{result.fetch.finalUrl}</span>
        <strong>리디렉션</strong>
        {result.fetch.redirects.length === 0 ? (
          <span>리디렉션 없음</span>
        ) : (
          <ol>
            {result.fetch.redirects.map((redirect) => (
              <li key={`${redirect.from}-${redirect.to}`}>
                {redirect.statusCode} {redirect.from} {"->"} {redirect.to}
              </li>
            ))}
          </ol>
        )}
      </div>

      <ul className="finding-list">
        {result.findings.map((finding) => (
          <FindingItem key={finding.checkId} finding={finding} />
        ))}
      </ul>
    </div>
  );
}

function FindingItem({ finding }: { finding: DiagnosisApiFinding }) {
  const status = getStatusCopy(finding.status);
  const copy = getFindingCopy(finding);
  const limitation = translateLimitation(finding.limitation);
  const evidence = summarizeEvidence(finding.evidence);

  return (
    <li>
      <span className={`finding-status status-${finding.status.toLowerCase()}`}>{status.label}</span>
      <div className="finding-body">
        <div className="finding-meta">
          <span>{getCategoryLabel(finding.category)}</span>
          <span>{getSeverityLabel(finding.severity)}</span>
        </div>
        <strong>{copy.title}</strong>
        <p>{copy.meaning}</p>
        <p>
          <b>권장 조치:</b> {finding.status === "PASS" ? "별도 조치가 필요하지 않습니다." : copy.action}
        </p>
        {limitation ? (
          <p>
            <b>제한:</b> {limitation}
          </p>
        ) : null}
        {evidence.length > 0 ? (
          <dl className="finding-evidence">
            {evidence.map((item) => {
              const [label, ...value] = item.split(": ");
              return (
                <div key={item}>
                  <dt>{label}</dt>
                  <dd>{value.join(": ")}</dd>
                </div>
              );
            })}
          </dl>
        ) : null}
      </div>
    </li>
  );
}
