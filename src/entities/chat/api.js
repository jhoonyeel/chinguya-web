// src/entities/chat/api.js
import { get, post } from "../../shared/api/http";
import { CHAT_BASE } from "../../shared/config/env";

/** POST /api/chat/session/create */
export function apiCreateSession() {
  return post(`${CHAT_BASE}/session/create`, {});
}

/** POST /api/chat/message { session_id, message } */
export function apiSendMessage(payload) {
  // payload: { session_id: string, message: string }
  return post(`${CHAT_BASE}/message`, payload);
}

/** POST /api/chat/session/end { session_id } */
export function apiEndSession(payload) {
  // payload: { session_id: string }
  return post(`${CHAT_BASE}/session/end`, payload);
}

/** GET /api/chat/session/{session_id}/history */
export function apiGetHistory(session_id) {
  return get(`${CHAT_BASE}/session/${session_id}/history`);
}
