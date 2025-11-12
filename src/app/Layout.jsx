// src/app/Layout.jsx
import { Outlet } from "react-router-dom";
import { TabBar } from "../widgets/ui/TabBar";

export default function Layout() {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-screen-sm min-h-screen mb-[calc(3rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </div>
      <TabBar />
    </div>
  );
}
