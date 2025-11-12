import { get } from "../../shared/api/http";
import { DIARY_BASE } from "../../shared/config/env";
// 서버 경로가 /api/diaries/... 이지만, 리소스는 diary이므로
// base는 재사용해도 됨.-

/** GET /api/diaries/weekly?days=7 (1~30) */
export function apiFetchWeeklyDiaries(days = 7) {
  return get(`${DIARY_BASE}/weekly?days=${days}`);
}

/** GET /api/diaries/date/{date}  (YYYY-MM-DD) */
export function apiFetchDiaryByDate(date) {
  return get(`${DIARY_BASE}/date/${date}`);
}
