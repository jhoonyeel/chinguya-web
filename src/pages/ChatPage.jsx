// src/pages/ChatPage.jsx  ← 교체(전용 레이아웃: 대화창 내부 스크롤 + 입력바 자체 패딩)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LS } from "../shared/lib/storage";
import { chatService } from "../entities/chat/model";
import { diaryService } from "../entities/diary/model";
import { Button } from "../widgets/ui/ui";

export const ChatPage = () => {
  const [messages, setMessages] = useState(() =>
    LS.get("chatMessages", [
      {
        role: "system",
        text: "안녕하세요. 마음이 조금 힘들 땐, 함께 이야기 나누면 도움이 될 거예요. 오늘 어떤 일들이 있었나요? 편하게 들려주세요.",
      },
    ])
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    LS.set("chatMessages", messages);
  }, [messages]);

  useEffect(() => {
    (async () => {
      try {
        const sid = await chatService.createSession();
        setSessionId(sid);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "세션 생성에 실패했습니다. 다시 시도해 주세요.",
          },
        ]);
      }
    })();
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const sid = sessionId ?? (await chatService.createSession());
      if (!sessionId) setSessionId(sid);
      const { answer } = await chatService.send(sid, text);
      setMessages([
        ...next,
        { role: "bot", text: answer || "그럴 수 있어요. 말씀 감사합니다." },
      ]);
    } catch {
      setMessages([
        ...next,
        { role: "bot", text: "서버 응답에 문제가 있습니다." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const retry = async (fn, tries = 3, base = 250) => {
    let lastErr;
    for (let i = 0; i < tries; i++) {
      try {
        return await fn();
      } catch (e) {
        lastErr = e;
        if (i < tries - 1)
          await new Promise((r) => setTimeout(r, base * 2 ** i));
      }
    }
    throw lastErr;
  };

  const makeDiary = async () => {
    if (!sessionId || loading) return;
    setLoading(true);
    try {
      await chatService.end(sessionId); // 리턴 무시
      const today = new Date().toISOString().slice(0, 10);
      await retry(() => diaryService.fetchByDate(today), 3, 250);
      nav(`/diary/date/${today}`, { replace: true });
      const sid = await chatService.createSession();
      setSessionId(sid);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "일기 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-screen-sm px-4 h-14 flex items-center justify-between">
          <h1 className="text-base font-semibold">챗봇 대화</h1>
        </div>
      </header>

      {/* 대화창(main): 내부 스크롤 */}
      <div className="mx-auto max-w-screen-sm w-full flex-1 min-h-0 overflow-y-auto px-4 pt-3 pb-3">
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : ""}`}
            >
              <div
                className={`rounded-2xl px-3 py-2 whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && <p className="text-sm">요청 처리 중…</p>}
        </div>
      </div>

      {/* 입력바: 탭바 위 공간 고려 */}
      <div className="sticky bottom-[calc(3rem+env(safe-area-inset-bottom))] w-full bg-gray-50 border-t">
        <div className="mx-auto max-w-screen-sm px-4 py-3">
          <div className="flex gap-2 items-center">
            <input
              className="flex-1 border rounded-lg p-3 bg-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요"
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            />
            <Button onClick={send} disabled={loading} aria-label="메시지 전송">
              전송
            </Button>
            <Button
              variant="outline"
              onClick={makeDiary}
              disabled={loading || !sessionId}
              aria-label="감정일기 생성"
              title="현재 대화를 바탕으로 감정일기 생성"
            >
              일기 생성
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
