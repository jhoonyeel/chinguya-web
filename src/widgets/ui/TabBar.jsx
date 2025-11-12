// src/widgets/ui/TabBar.jsx  ← 교체
import { NavLink } from "react-router-dom";

export const TabBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur shadow-lg">
      <div className="mx-auto max-w-screen-sm grid grid-cols-3 h-12 px-2 pb-[env(safe-area-inset-bottom)]">
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
    </nav>
  );
};
