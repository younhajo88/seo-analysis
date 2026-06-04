export type BackendStatus =
  | "checking"
  | "connected"
  | "disconnected"
  | "misconfigured"
  | "error";

export const defaultBackendUrl = "http://localhost:4317";

export const backendStatusCopy: Record<
  BackendStatus,
  {
    title: string;
    description: string;
    actionLabel: string;
  }
> = {
  checking: {
    title: "로컬 진단 서버 확인 중",
    description: "브라우저에서 로컬 진단 서버의 상태를 확인하고 있습니다.",
    actionLabel: "연결 확인 중"
  },
  connected: {
    title: "로컬 진단 서버 연결됨",
    description: "URL 크롤링과 Search Console 진단을 실행할 준비가 되었습니다.",
    actionLabel: "진단 실행"
  },
  disconnected: {
    title: "로컬 진단 서버가 필요합니다",
    description:
      "공개 페이지는 계속 볼 수 있지만, 실제 URL 크롤링과 GSC 조회는 사용자의 PC에서 로컬 진단 서버가 실행 중일 때만 가능합니다.",
    actionLabel: "로컬 진단 서버 연결 필요"
  },
  misconfigured: {
    title: "서버 주소를 확인해 주세요",
    description:
      "설정된 로컬 진단 서버 주소가 올바르지 않거나 지원 버전과 맞지 않습니다.",
    actionLabel: "설정 확인 필요"
  },
  error: {
    title: "진단 서버 응답 오류",
    description:
      "로컬 서버가 응답했지만 예상한 상태 정보를 반환하지 않았습니다. 서버 로그와 버전을 확인해 주세요.",
    actionLabel: "다시 확인"
  }
};

export function canRunDiagnosis(status: BackendStatus) {
  return status === "connected";
}
