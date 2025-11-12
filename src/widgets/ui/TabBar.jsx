// src/widgets/ui/TabBar.jsx  ← 교체
import { NavLink } from "react-router-dom";

export const TabBar = () => {
  return (
    // 풀폭 고정(투명). 이벤트는 안쪽 컨테이너에서만 받도록 처리
    <nav className="fixed inset-x-0 bottom-0 z-30 bg-transparent pointer-events-none">
      {/* 헤더와 동일한 폭 제한 */}
      <div className="mx-auto max-w-screen-sm w-full pointer-events-auto">
        {/* 실제 바(배경/테두리/그리드)는 안쪽에만 적용 → 헤더와 폭 일치 */}
        <div
          className="grid grid-cols-3 h-12 px-2 pb-[env(safe-area-inset-bottom)] 
                        border-t bg-white/95 backdrop-blur shadow-lg"
        >
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center text-xs ${
                isActive ? "font-semibold text-blue-600" : "text-gray-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>대화</span>
                {isActive && (
                  <span className="mt-0.5 h-0.5 w-6 bg-blue-600 rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/diary"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center text-xs ${
                isActive ? "font-semibold text-blue-600" : "text-gray-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>감정일기</span>
                {isActive && (
                  <span className="mt-0.5 h-0.5 w-6 bg-blue-600 rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/more"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center text-xs ${
                isActive ? "font-semibold text-blue-600" : "text-gray-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>더보기</span>
                {isActive && (
                  <span className="mt-0.5 h-0.5 w-6 bg-blue-600 rounded-full" />
                )}
              </>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
