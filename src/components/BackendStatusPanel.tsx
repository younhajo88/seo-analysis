"use client";

import { useEffect, useState } from "react";
import { Cable, CircleCheck, CircleOff, RefreshCw } from "lucide-react";
import {
  backendStatusCopy,
  canRunDiagnosis,
  defaultBackendUrl,
  type BackendStatus
} from "@/lib/backend-status";

export function BackendStatusPanel() {
  const [status, setStatus] = useState<BackendStatus>("checking");
  const [backendUrl, setBackendUrl] = useState(defaultBackendUrl);

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
          <p className="eyebrow">로컬 서버 상태</p>
          <h2 id="backend-status-title">{copy.title}</h2>
        </div>
      </div>
      <p>{copy.description}</p>

      <label className="field">
        <span>로컬 진단 서버 주소</span>
        <input
          value={backendUrl}
          onChange={(event) => setBackendUrl(event.target.value)}
          placeholder={defaultBackendUrl}
        />
      </label>

      <div className="diagnosis-actions">
        <button type="button" className="secondary-button" onClick={() => void checkBackend()}>
          <RefreshCw size={16} />
          연결 다시 확인
        </button>
        <button type="button" className="primary-button" disabled={!enabled}>
          <Cable size={16} />
          {copy.actionLabel}
        </button>
      </div>

      {!enabled ? (
        <div className="disabled-note">
          <strong>진단은 아직 실행되지 않았습니다.</strong>
          <span>
            공개 페이지는 검색엔진이 읽을 수 있지만, URL 크롤링과 GSC 조회는 로컬
            백엔드가 연결된 뒤에만 시작됩니다.
          </span>
        </div>
      ) : null}
    </section>
  );
}
