// src/pages/MorePage.jsx
import { useAuth } from "../shared/auth/AuthContext";

// ✅ 현재 버전 변경사항 (배열 형태)
const CURRENT_VERSION_NOTES = [
  "PHQ-9 점검(필요 시 9문항)",
  "주간 일기 조회(최근 N일) 및 날짜별 상세 보기",
  "세션 종료 시 당일 일기 자동 생성 및 상세 화면 이동",
];

export const MorePage = () => {
  const { user, logout } = useAuth();

  // ✅ .env 설정: VITE_APP_VERSION=${npm_package_version}
  const raw = import.meta.env.VITE_APP_VERSION || "0.0.0";
  const version = raw.startsWith("v") ? raw : `v${raw}`;

  const feedbackUrl = "https://forms.gle/uxEuqHfakGfWBroG8";

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <header className="p-4 border-b">
        <h1 className="text-lg font-medium">더보기</h1>
      </header>

      <main className="p-4 space-y-8">
        {/* 1️⃣ 피드백 */}
        <section>
          <h2 className="text-sm font-semibold mb-2">피드백</h2>
          <p className="text-sm mb-2">
            서비스 이용 중 느낀 점이나 개선 의견을 남겨주세요.
          </p>
          <a
            href={feedbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border rounded px-4 py-2 inline-block text-sm"
            aria-label="서비스 피드백 창구(새 창)"
          >
            서비스 피드백 창구
          </a>
        </section>

        {/* 2️⃣ 버전 정보 */}
        <section>
          <h2 className="text-sm font-semibold mb-2">버전 정보</h2>
          <p className="text-sm">
            현재 버전: <b>{version}</b>
          </p>
          <div className="mt-3 border rounded p-3">
            <div className="text-sm font-semibold mb-2">변경 사항</div>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {CURRENT_VERSION_NOTES.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3️⃣ 계정 */}
        <section>
          <h2 className="text-sm font-semibold mb-2">계정</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              <span className="font-medium">{user?.nickname ?? "사용자"}</span>
              {user?.email && (
                <span className="text-gray-500"> · {user.email}</span>
              )}
            </p>
            <button
              className="border rounded px-4 py-2 text-sm"
              onClick={logout}
            >
              로그아웃
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
