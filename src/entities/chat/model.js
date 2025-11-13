// src/entities/chat/model.js  ← 교체
import {
  apiCreateSession,
  apiSendMessage,
  apiEndSession,
  apiGetHistory,
} from "./api";

const SYSTEM_OPENING = {
  role: "system",
  text: "안녕하세요. 마음이 조금 힘들 땐, 함께 이야기 나누면 도움이 될 거예요. 오늘 어떤 일들이 있었나요? 편하게 들려주세요.",
};

export const chatService = {
  async createSession() {
    const res = await apiCreateSession();
    const data = res?.data;
    if (!data?.session_id) throw new Error("세션 생성 실패: session_id 없음");
    return data.session_id;
  },

  async history(session_id) {
    if (!session_id) throw new Error("세션 ID가 필요합니다.");
    const res = await apiGetHistory(session_id);
    const d = res?.data ?? {};
    const list = Array.isArray(d.messages) ? d.messages : [];

    // 서버 형식(role, content, timestamp) → UI 형식(role, text)
    const mapped = list.map((m) => ({
      role: m.role === "assistant" ? "bot" : m.role, // user | assistant | system → user | bot | system
      text: m.content ?? "",
      ts: m.timestamp,
    }));

    // 히스토리가 비어 있으면 시스템 첫 질문으로 시작
    return mapped.length > 0 ? mapped : [SYSTEM_OPENING];
  },

  async send(session_id, message) {
    if (!session_id) throw new Error("세션 ID가 필요합니다.");
    const res = await apiSendMessage({ session_id, message });
    const data = res?.data ?? {};
    return {
      session_id: data.session_id,
      answer: data.assistant_response,
      referencedDiaries: data.referenced_diaries ?? null,
      raw: res,
    };
  },

  async end(session_id) {
    if (!session_id) throw new Error("세션 ID가 필요합니다.");
    const res = await apiEndSession({ session_id });
    const d = res?.data ?? {};
    const diary = {
      id: d.diary_id ?? String(Date.now()),
      content: d.diary_content ?? "",
      reframed: d.alternative_perspective ?? "",
      messageCount: Number(d.message_count ?? 0),
    };
    return { diary, raw: res };
  },
};
