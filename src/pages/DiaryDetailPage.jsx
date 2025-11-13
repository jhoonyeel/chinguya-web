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
      <PageShell title="감정일기" mainScrollable mainClassName="px-4 py-3">
        <Card className="p-4 animate-pulse">
          <div className="h-5 w-40 bg-gray-200 rounded mb-3" />
          <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </Card>
      </PageShell>
    );
  }

  if (err || !diary) {
    return (
      <PageShell title="감정일기" mainScrollable mainClassName="px-4 py-3">
        <p className="text-sm">{err || "해당 날짜의 일기가 없습니다."}</p>
        <Link to="/diary" className="underline text-sm mt-2 inline-block">
          ← 목록으로
        </Link>
      </PageShell>
    );
  }

  const dateLabel =
    diary.date ||
    diary?.createdAt?.slice?.(0, 10) ||
    diary?.metadata?.diary_date ||
    date;

  // 대안 관점 텍스트 정규화(양끝 큰따옴표 제거)
  const altRaw =
    diary.reframed ?? diary?.metadata?.alternative_perspective ?? "";
  const altText =
    typeof altRaw === "string" ? altRaw.replace(/^"(.*)"$/, "$1") : "";

  const msgCount =
    typeof diary?.messageCount === "number"
      ? diary.messageCount
      : Number(diary?.metadata?.message_count ?? 0);

  return (
    <PageShell title={dateLabel} mainScrollable mainClassName="px-4 py-3">
      <div className="space-y-4">
        {/* 본문 카드 */}
        <Card className="p-5">
          {/* 타이틀 레벨 1 */}
          <h2 className="text-xl font-semibold tracking-tight">감정일기</h2>

          {/* 보조 메타 정보 */}
          <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              작성일: {dateLabel}
            </span>
            {msgCount > 0 && (
              <>
                <span aria-hidden className="text-gray-300">
                  •
                </span>
                <span>대화 메시지 {msgCount}개 기반</span>
              </>
            )}
          </div>

          {/* 본문(가독성 향상: 크기/행간/여백) */}
          <div className="mt-4 text-[15px] leading-7 text-gray-800 whitespace-pre-wrap">
            {diary.content || "(내용 없음)"}
          </div>
        </Card>

        {/* 대안적 관점 카드 (있을 때만) */}
        {altText && (
          <Card className="p-5">
            {/* 섹션 라벨(레벨 2) */}
            <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              대안적 관점
            </div>
            {/* 인용 스타일 본문 */}
            <div className="mt-2 border-l-4 border-blue-200 pl-3">
              <p className="text-[15px] leading-7 text-gray-800 whitespace-pre-wrap">
                {altText}
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              * 스스로를 비난하기보다 상황을 다른 각도에서 바라보도록 돕는 안내
              문장입니다.
            </p>
          </Card>
        )}

        <div className="pt-1">
          <Link to="/diary" className="underline text-sm inline-block">
            ← 목록으로
          </Link>
        </div>
      </div>
    </PageShell>
  );
};
