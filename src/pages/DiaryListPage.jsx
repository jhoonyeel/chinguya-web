// src/pages/DiaryListPage.jsx  ← 교체
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { diaryService } from "../entities/diary/model";
import { PageShell, Card, Button } from "../widgets/ui/ui";

export const DiaryListPage = () => {
  const [days, setDays] = useState(7);
  const [items, setItems] = useState([]);
  const [pending, setPending] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setPending(true);
      setErr("");
      try {
        const { diaries } = await diaryService.fetchWeekly(days);
        if (alive) setItems(diaries);
      } catch {
        if (alive) setErr("일기 목록을 불러오지 못했습니다.");
      } finally {
        if (alive) setPending(false);
      }
    })();
    return () => (alive = false);
  }, [days]);

  return (
    <PageShell title="감정일기">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-sm">조회 기간(일)</label>
          <input
            type="number"
            min={1}
            max={30}
            className="w-24 border rounded-lg p-2 bg-white"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />
          <div className="flex gap-1">
            {[7, 14, 30].map((v) => (
              <Button
                key={v}
                variant="outline"
                size="sm"
                onClick={() => setDays(v)}
              >
                {v}일
              </Button>
            ))}
          </div>
        </div>

        {pending && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-3 animate-pulse">
                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
              </Card>
            ))}
          </div>
        )}

        {err && <p className="text-sm text-red-600">{err}</p>}

        {!pending && !err && items.length === 0 && (
          <Card className="p-4">
            <p className="text-sm text-gray-700">
              최근 {days}일 내 일기가 없습니다.{" "}
              <Link to="/chat" className="underline">
                챗봇
              </Link>
              에서 생성해보세요.
            </p>
          </Card>
        )}

        <ul className="space-y-2">
          {items.map((d) => {
            const date = d.createdAt?.slice(0, 10); // YYYY-MM-DD
            const preview =
              (d.content || "").length > 80
                ? d.content.slice(0, 80) + "…"
                : d.content || "(내용 없음)";
            return (
              <li key={d.id}>
                <Card>
                  <Link
                    to={`/diary/date/${date}`}
                    className="block p-3 hover:bg-gray-50 rounded-xl"
                  >
                    <div className="text-xs text-gray-500">{date}</div>
                    <div className="mt-1 text-sm text-gray-800 line-clamp-2">
                      {preview}
                    </div>
                  </Link>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </PageShell>
  );
};
