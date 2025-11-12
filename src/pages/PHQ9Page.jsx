// src/pages/PHQ9Page.jsx  ← 교체(하단 버튼 단순화, sticky 제거)
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../shared/auth/AuthContext";
import { checkupStore } from "../shared/lib/checkup";
import { PageShell, Card, Button } from "../widgets/ui/ui";

const OPTIONS = [
  { label: "없음", value: 0 },
  { label: "2~6일", value: 1 },
  { label: "7~12일", value: 2 },
  { label: "거의 매일", value: 3 },
];

const QUESTIONS = [
  "기분이 가라앉거나, 우울하거나, 희망이 없다고 느꼈다.",
  "평소 하던 일에 대한 흥미가 없어지거나 즐거움을 느끼지 못했다.",
  "잠들기가 어렵거나 자주 깼다 / 혹은 너무 많이 잤다.",
  "평소보다 식욕이 줄었다 / 혹은 평소보다 많이 먹었다.",
  "다른 사람들이 눈치 챌 정도로 말/행동이 느려졌다 / 혹은 너무 안절부절못했다.",
  "피곤하고 기운이 없었다.",
  "내가 잘못했거나 실패했다는 생각 / 자신과 가족을 실망시켰다고 느꼈다.",
  "신문/TV 같은 일상에도 집중할 수 없었다.",
  "차라리 죽는 것이 낫겠다 / 자해 생각이 들었다.",
];

function category(score) {
  if (score <= 4) return "최소";
  if (score <= 9) return "경도";
  if (score <= 14) return "중등도";
  if (score <= 19) return "중등도-중증";
  return "중증";
}

export const PHQ9Page = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const [answers, setAnswers] = useState(() => Array(9).fill(null));
  const [stage, setStage] = useState("phq2"); // 'phq2' | 'phq9' | 'result'

  const sum = useMemo(
    () => answers.reduce((a, v) => a + (typeof v === "number" ? v : 0), 0),
    [answers]
  );
  const percent = Math.round((sum / 27) * 100);
  const answeredAll = useMemo(
    () => answers.every((v) => typeof v === "number"),
    [answers]
  );
  const qRange = stage === "phq2" ? [0, 1] : [0, 8];
  const risk = (answers[8] ?? 0) >= 1;

  const onChange = (qi, v) =>
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = v;
      return next;
    });

  const handleNextFromPHQ2 = () => {
    const sum2 = (answers[0] ?? 0) + (answers[1] ?? 0);
    if (sum2 === 0) {
      if (user?.id) checkupStore.setCheckedNow(user.id);
      setStage("result");
    } else {
      setStage("phq9");
    }
  };

  const handleSubmitFull = () => {
    if (!answeredAll) return;
    if (user?.id) checkupStore.setCheckedNow(user.id);
    setStage("result");
  };

  return (
    <PageShell
      title="우울 자가 점검"
      right={<span className="text-xs text-gray-500">최근 2주 기준</span>}
      mainScrollable
      mainClassName="px-4 py-3"
    >
      {stage !== "result" && (
        <div>
          {stage === "phq2" && (
            <div className="mb-3 text-sm text-gray-700">
              먼저 2문항을 확인한 뒤, 필요하면 나머지 문항을 이어갑니다.
            </div>
          )}

          <ol className="space-y-4">
            {QUESTIONS.slice(qRange[0], qRange[1] + 1).map((q, idx) => {
              const qi = qRange[0] + idx;
              return (
                <li key={qi}>
                  <Card className="p-4">
                    <p className="mb-3">
                      {qi + 1}. {q}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {OPTIONS.map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-center gap-2 border rounded p-2 cursor-pointer ${
                            answers[qi] === opt.value
                              ? "ring-2 ring-blue-500 border-blue-500"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${qi}`}
                            className="sr-only"
                            checked={answers[qi] === opt.value}
                            onChange={() => onChange(qi, opt.value)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ol>

          {/* 하단 액션: 두 단계 동일 형태(세로선 없음) */}
          <div className="mt-6 flex flex-wrap gap-2 pb-2">
            {stage === "phq2" ? (
              <>
                <Button
                  onClick={handleNextFromPHQ2}
                  disabled={answers[0] == null || answers[1] == null}
                >
                  계속
                </Button>
                <Button variant="outline" onClick={() => setStage("phq9")}>
                  9문항 모두 답변하기
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setStage("phq2")}>
                  뒤로
                </Button>
                <Button onClick={handleSubmitFull} disabled={!answeredAll}>
                  결과 보기
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {stage === "result" && (
        <div className="space-y-4">
          {risk && (
            <div className="border border-red-300 bg-red-50 text-red-700 p-3 rounded-lg">
              문항 9에 응답하셨습니다.{" "}
              <b>긴급 위험이 느껴지면 119 또는 가까운 응급실에 연락</b>해
              주세요. 도움이 필요하면 <b>국번없이 1393</b>(자살예방상담) 등
              전문기관에 즉시 상담을 요청하세요.
            </div>
          )}

          <Card className="p-4">
            <h2 className="font-semibold mb-2">결과</h2>
            <p className="text-2xl font-bold">
              총점 {sum} / 27{" "}
              <span className="text-gray-500 text-base">({percent}%)</span>
            </p>
            <p className="mt-1 text-gray-700">
              범주: <b>{category(sum)}</b>
            </p>
            <div aria-hidden className="h-2 bg-gray-200 rounded mt-3">
              <div
                className="h-2 bg-blue-600 rounded"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-gray-600">
              이 결과는 자기점검용 참고 자료이며 의학적 진단이 아닙니다.
              어려움이 지속되면 전문가 상담을 권합니다.
            </p>
          </Card>

          <div className="flex gap-2 pb-2">
            <Button variant="outline" onClick={() => setStage("phq9")}>
              수정하기
            </Button>
            <Button onClick={() => nav("/chat")}>챗봇과 이어서 대화하기</Button>
          </div>
        </div>
      )}
    </PageShell>
  );
};
