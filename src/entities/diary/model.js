// src/entities/diary/model.js  ← 교체
import { apiFetchWeeklyDiaries, apiFetchDiaryByDate } from "./api";

/** 앱 공통 Diary 모델로 정규화 */
function toDiary(raw) {
  if (!raw) return null;
  const md = raw.metadata ?? {};
  return {
    // 서버 메타의 diary_id 우선
    id:
      md.diary_id ??
      raw.diary_id ??
      raw.diary_date ??
      md.created_at ??
      String(Date.now()),
    content: raw.content ?? "",
    metadata: md,
    // 생성 시각(ISO) — 메타에 존재
    createdAt: md.created_at ?? null,
    // 일기 기준일(YYYY-MM-DD) — 라우팅/표시에 사용
    date: raw.diary_date ?? null,
    // 부가 정보
    messageCount: Number(md.message_count ?? 0),
    reframed: md.alternative_perspective ?? "",
  };
}

/** 서버 리스트 응답 → 정규화 */
function toWeekly(result) {
  const d = result?.data ?? {};
  const list = Array.isArray(d.diaries) ? d.diaries.map(toDiary) : [];
  return {
    days: Number(d.days ?? 0),
    count: Number(d.count ?? list.length),
    diaries: list,
    raw: result,
  };
}

export const diaryService = {
  /** 최근 N일(1~30, 기본 7) */
  async fetchWeekly(days = 7) {
    const n = Math.max(1, Math.min(30, Number(days) || 7));
    const res = await apiFetchWeeklyDiaries(n);
    return toWeekly(res);
  },

  /** 특정 날짜(YYYY-MM-DD) */
  async fetchByDate(date) {
    if (!date) throw new Error("date가 필요합니다(YYYY-MM-DD).");
    const res = await apiFetchDiaryByDate(date);
    const item = toDiary(res?.data);
    return { diary: item, raw: res };
  },
};
