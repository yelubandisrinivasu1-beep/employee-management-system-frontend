"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { FiHome, FiList, FiCheckCircle, FiCalendar, FiUsers, FiCpu, FiStar, FiBell, FiMenu } from "react-icons/fi";
import API from "@/lib/axios";

export default function TechnicalManagerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: <FiHome />, href: "/technical-manager" },
    { id: "tasks", label: "Task Module", icon: <FiList />, href: "/technical-manager/tasks" },
    { id: "team", label: "My Team", icon: <FiUsers />, href: "/technical-manager/team" },
    { id: "sprints", label: "Sprints", icon: <FiCheckCircle />, href: "/technical-manager/sprints" },
    { id: "attendance", label: "Attendance", icon: <FiCalendar />, href: "/technical-manager/attendance" },
    { id: "performance", label: "Performance", icon: <FiStar />, href: "/technical-manager/performance" },
    { id: "notifications", label: "Notifications", icon: <FiBell />, href: "/technical-manager/notifications" },
  ];

  let activeView = "dashboard";
  if (pathname.includes("/tasks")) activeView = "tasks";
  if (pathname.includes("/team")) activeView = "team";
  if (pathname.includes("/sprints")) activeView = "sprints";
  if (pathname.includes("/attendance")) activeView = "attendance";
  if (pathname.includes("/performance")) activeView = "performance";
  if (pathname.includes("/notifications")) activeView = "notifications";

  return (
    <ProtectedRoute allowedRoles={["technical_manager", "admin"]}>
      <div className="flex h-screen overflow-hidden bg-slate-900 font-sans text-slate-200">
        <Sidebar 
          items={sidebarItems} 
          activeView={activeView} 
          onSelectView={() => {}} 
          userName={user?.name || "Tech Manager"}
          userRole={user?.role || "technical_manager"}
          isMobileOpen={isMobileSidebarOpen}
          onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative">
          <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10 px-8 py-6 shrink-0 relative">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="md:hidden absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-slate-800/50 p-2 rounded-lg backdrop-blur-md hover:bg-slate-700/50 transition-colors border border-slate-700/50"
            >
              <FiMenu className="w-5 h-5 text-slate-300" />
            </button>
            
            <div className="max-w-7xl mx-auto flex gap-4 items-center md:ml-0 ml-12">
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-inner">
                <FiCpu className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <p className="text-indigo-400 font-semibold text-xs tracking-widest uppercase mb-1">Pengwin Tech Solution</p>
                <h1 className="text-2xl font-bold text-white tracking-tight">Technical Manager Console</h1>
                <p className="text-slate-400 text-sm">Tech team oversight and attendance tracking</p>
              </div>
            </div>
          </div>

          <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}