# Local API Contract

## Base URL

Default:

```text
http://localhost:4317
```

The frontend should allow this to be configured by the user.

## Shared Types

### Status

```text
PASS
WARN
FAIL
MANUAL
UNAVAILABLE
```

### Severity

```text
Critical
High
Medium
Low
Unavailable
```

### Finding

```json
{
  "checkId": "reach.http_status",
  "category": "Reachability",
  "source": "local-fetch",
  "status": "PASS",
  "severity": "Critical",
  "target": "https://example.com/",
  "evidence": {
    "statusCode": 200
  },
  "recommendation": "페이지가 정상 응답합니다.",
  "limitation": null
}
```

### Summary

```json
{
  "pass": 4,
  "warn": 2,
  "fail": 0,
  "manual": 0,
  "unavailable": 0
}
```

## `GET /health`

### Purpose

Let the Vercel frontend detect whether the local diagnosis backend is running.

### Response `200`

```json
{
  "ok": true,
  "name": "seo-analysis-local-backend",
  "version": "0.1.0",
  "phase": "reachability",
  "time": "2026-06-04T05:00:00.000Z",
  "limits": {
    "timeoutMs": 10000,
    "maxRedirects": 10,
    "maxResponseBytes": 2097152
  }
}
```

### Notes

- This route does not touch the database.
- This route should be fast and safe.
- This route should be CORS-accessible only from allowed origins.

## `POST /diagnose/url`

### Purpose

Run Phase 1 reachability checks for one target URL.

### Request

```json
{
  "url": "https://example.com",
  "expectedFinalUrl": "https://www.example.com/"
}
```

Fields:

| Field | Required | Meaning |
| --- | --- | --- |
| `url` | Yes | Target URL to diagnose |
| `expectedFinalUrl` | No | User-expected final canonical URL for `reach.final_url_expected` |

If `expectedFinalUrl` is omitted, the check should compare the final URL against the normalized input URL where useful and return `WARN` only for obvious host/protocol drift.

### Response `200`

```json
{
  "run": {
    "id": "run_01H...",
    "targetUrl": "https://example.com",
    "finalUrl": "https://www.example.com/",
    "startedAt": "2026-06-04T05:00:00.000Z",
    "completedAt": "2026-06-04T05:00:01.000Z",
    "overallStatus": "WARN",
    "summary": {
      "pass": 4,
      "warn": 2,
      "fail": 0,
      "manual": 0,
      "unavailable": 0
    }
  },
  "fetch": {
    "inputUrl": "https://example.com",
    "finalUrl": "https://www.example.com/",
    "finalStatusCode": 200,
    "finalHeaders": {
      "content-type": "text/html; charset=utf-8"
    },
    "redirects": [
      {
        "from": "https://example.com",
        "to": "https://www.example.com/",
        "statusCode": 301
      }
    ],
    "timingMs": 850,
    "bytesRead": 49212,
    "truncated": false
  },
  "findings": [
    {
      "checkId": "reach.http_status",
      "category": "Reachability",
      "source": "local-fetch",
      "status": "PASS",
      "severity": "Critical",
      "target": "https://www.example.com/",
      "evidence": {
        "statusCode": 200
      },
      "recommendation": "페이지가 정상 응답합니다.",
      "limitation": null
    }
  ]
}
```

### Error Response `400`

Use for invalid user input:

```json
{
  "error": {
    "code": "INVALID_URL",
    "message": "올바른 http 또는 https URL을 입력해 주세요."
  }
}
```

### Error Response `403`

Use for blocked targets:

```json
{
  "error": {
    "code": "UNSAFE_TARGET",
    "message": "공개 HTTP/HTTPS URL만 진단할 수 있습니다.",
    "details": {
      "reason": "PRIVATE_IP_BLOCKED"
    }
  }
}
```

### Error Response `504`

Use for timeout:

```json
{
  "error": {
    "code": "FETCH_TIMEOUT",
    "message": "대상 URL 응답 시간이 제한을 초과했습니다."
  }
}
```

## Phase 1 Check Behavior

### `reach.http_status`

PASS:

- final status code is `200`.

WARN:

- final status code is another 2xx where indexability may still be possible.
- final status code is 3xx after redirect limit handling, if unresolved.

FAIL:

- final status code is 4xx or 5xx.
- fetch failed.

### `reach.redirect_chain`

PASS:

- zero to two redirects.

WARN:

- three to ten redirects.

FAIL:

- redirect count exceeds `maxRedirects`.

### `reach.redirect_loop`

PASS:

- no repeated redirect destination is detected.

FAIL:

- redirect loop is detected.

### `reach.final_url_expected`

PASS:

- final URL matches `expectedFinalUrl`, if provided.
- or final URL is a reasonable normalized form of the input URL.

WARN:

- host, protocol, or path changed unexpectedly.

### `reach.https_available`

PASS:

- final URL uses `https:`.

WARN:

- input URL used `http:` but redirects to `https:`.

FAIL:

- final URL remains `http:`.

### `reach.http_to_https`

PASS:

- `http://host` redirects to equivalent `https://host` when applicable.

WARN:

- HTTPS is available but HTTP does not redirect cleanly.
- Host canonicalization makes this ambiguous.

MANUAL:

- cannot test because original input was not HTTP and generated HTTP variant is unsafe or unavailable.

## Persistence Contract

Every successful `POST /diagnose/url` should persist:

- one `diagnosis_runs` row;
- one `diagnosis_findings` row per finding.

Failed unsafe or invalid requests do not need to create runs.

Timeouts and fetch failures may create runs if the request URL itself passed safety validation.

## Frontend Contract

The `/diagnose` page should:

- call `GET /health` on mount and on manual retry;
- enable URL input and diagnosis submit only when health status is connected;
- call `POST /diagnose/url` with user-provided URL;
- show loading state during diagnosis;
- show summary counts;
- show final URL and redirect chain;
- show findings grouped by severity or status;
- show backend/API error messages without pretending a diagnosis completed.
