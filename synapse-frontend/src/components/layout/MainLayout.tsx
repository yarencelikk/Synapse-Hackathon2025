import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    // DÜZELTME: Hem açık hem de koyu mod için arka plan ve metin renkleri eklendi.
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-gray-800 dark:text-gray-300 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
