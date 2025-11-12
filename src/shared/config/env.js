// src/shared/config/env.js
// 기본은 빈 문자열("") → 상대경로(`/api/...`) 사용
// 필요할 때만 VITE_API_BASE로 덮어씌움(예: 로컬 개발 직결 테스트)
const RAW_BASE = (import.meta.env.VITE_API_BASE || "").trim();

/** base와 path를 안전하게 합치기 */
function join(base, path) {
  if (!base) return path; // 상대경로 사용
  const b = base.replace(/\/+$/, ""); // 끝 슬래시 제거
  const p = path.replace(/^\/+/, ""); // 시작 슬래시 제거
  return `${b}/${p}`;
}

// 도메인 경계: 여기서는 항상 '/api/...'가 되도록 설계
export const AUTH_BASE = join(RAW_BASE, "/api/auth");
export const CHAT_BASE = join(RAW_BASE, "/api/chat");
export const CHATBOT_BASE = join(RAW_BASE, "/api/chatbot");
export const DIARY_BASE = join(RAW_BASE, "/api/diaries");
