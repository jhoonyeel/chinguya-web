// src/app/AppRouter.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RequireAuth, PublicOnly, RequireCheckupDone } from "./Guard";
import { lazy } from "react";
import Layout from "./Layout";

const LoginPage = lazy(() =>
  import("../pages/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import("../pages/RegisterPage").then((m) => ({ default: m.RegisterPage }))
);
const ChatPage = lazy(() =>
  import("../pages/ChatPage").then((m) => ({ default: m.ChatPage }))
);
const DiaryListPage = lazy(() =>
  import("../pages/DiaryListPage").then((m) => ({ default: m.DiaryListPage }))
);
const DiaryDetailPage = lazy(() =>
  import("../pages/DiaryDetailPage").then((m) => ({
    default: m.DiaryDetailPage,
  }))
);
const PHQ9Page = lazy(() =>
  import("../pages/PHQ9Page").then((m) => ({ default: m.PHQ9Page }))
);
const MorePage = lazy(() =>
  import("../pages/MorePage").then((m) => ({ default: m.MorePage }))
);

const router = createBrowserRouter([
  // 공개 라우트
  {
    element: <PublicOnly />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  // 보호 라우트
  {
    element: <RequireAuth />,
    children: [
      // ⛔ Layout 밖: PHQ-9 (TabBar 미노출)
      { path: "/checkup", element: <PHQ9Page /> },

      // ✅ Layout 안: TabBar 노출 + 점검 완료 필요
      {
        element: <Layout />,
        children: [
          {
            element: <RequireCheckupDone />,
            children: [
              { path: "/", element: <ChatPage /> },
              { path: "/chat", element: <ChatPage /> },
              { path: "/diary", element: <DiaryListPage /> },
              { path: "/diary/date/:date", element: <DiaryDetailPage /> },
              { path: "/more", element: <MorePage /> },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <div className="p-4">페이지를 찾을 수 없습니다.</div> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
