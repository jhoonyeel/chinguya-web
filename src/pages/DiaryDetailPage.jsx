// src/pages/DiaryDetailPage.jsx  ← 교체
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { diaryService } from "../entities/diary/model";
import { PageShell, Card } from "../widgets/ui/ui";

export const DiaryDetailPage = () => {
  const { date } = useParams(); // /diary/date/:date
  const [pending, setPending] = useState(true);
  const [err, setErr] = useState("");
  const [diary, setDiary] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setPending(true);
      setErr("");
      try {
        const { diary: d } = await diaryService.fetchByDate(date);
        if (alive) setDiary(d);
      } catch {
        if (alive) setErr("일기를 불러오지 못했습니다.");
      } finally {
        if (alive) setPending(false);
      }
    })();
    return () => (alive = false);
  }, [date]);

  if (pending) {
    return (
      <PageShell title="감정일기">
        <Card className="p-4 animate-pulse">
          <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </Card>
      </PageShell>
    );
  }

  if (err || !diary) {
    return (
      <PageShell title="감정일기">
        <p className="text-sm">{err || "해당 날짜의 일기가 없습니다."}</p>
        <Link to="/diary" className="underline text-sm mt-2 inline-block">
          ← 목록으로
        </Link>
      </PageShell>
    );
  }

  const dateLabel =
    (diary.createdAt && new Date(diary.createdAt).toLocaleDateString()) || date;

  return (
    <PageShell title={dateLabel}>
      <Card className="p-4">
        <h2 className="font-medium">일기</h2>
        <p className="mt-2 whitespace-pre-wrap text-gray-800">
          {diary.content || "(내용 없음)"}
        </p>
        <Link to="/diary" className="underline text-sm mt-3 inline-block">
          ← 목록으로
        </Link>
      </Card>
    </PageShell>
  );
};
