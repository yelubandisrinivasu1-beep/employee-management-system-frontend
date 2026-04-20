"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import EmployeeManager from "@/components/EmployeeManager";
import SystemActivityLogs from "@/components/SystemActivityLogs";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { FiUsers, FiCheckCircle, FiXCircle, FiCalendar, FiDollarSign, FiActivity, FiHome, FiLogOut, FiBriefcase, FiBox, FiStar, FiBell, FiMenu } from "react-icons/fi";
import DepartmentManager from "@/components/DepartmentManager";
import TeamManager from "@/components/TeamManager";
import ProjectManager from "@/components/ProjectManager";
import PerformanceManager from "@/components/PerformanceManager";
import NotificationCenter from "@/components/NotificationCenter";

type DashboardData = {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  leaveToday: number;
  totalSalaryRecords: number;
};

export default function ManagerPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: <FiHome /> },
    { id: "employees", label: "Manage Employees", icon: <FiUsers /> },
    { id: "departments", label: "Departments", icon: <FiBriefcase /> },
    { id: "teams", label: "Teams", icon: <FiUsers /> },
    { id: "projects", label: "Projects", icon: <FiBox /> },
    { id: "performance", label: "Performance", icon: <FiStar /> },
    { id: "notifications", label: "Notifications", icon: <FiBell /> },
    { id: "activity", label: "System Activity Logs", icon: <FiActivity /> },
    // Live chat is global, so no need for explicit view, but could trigger it
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard/manager");
        setData(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["manager", "admin"]}>
      <div className="flex min-h-screen bg-slate-50 font-sans manager-dashboard">
        <Sidebar
          items={sidebarItems}
          activeView={activeView}
          onSelectView={setActiveView}
          userName={user?.name || "Manager"}
          userRole={user?.role || "manager"}
          isMobileOpen={isMobileSidebarOpen}
          onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative">
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <FiMenu className="w-5 h-5 text-slate-700" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                {user?.name?.[0]?.toUpperCase() || "M"}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Manager Dashboard</p>
                <p className="text-xs text-slate-500">Tap menu to navigate</p>
              </div>
            </div>
          </div>
          {/* Header Banner */}
          <div className="sticky md:fixed md:top-0 md:left-64 md:right-0 top-0 z-30 bg-gradient-to-r from-blue-800 to-indigo-700 text-white pb-4 pt-6 px-10 border-b-4 border-blue-400 shrink-0">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
              <div>
                <p className="text-blue-300 font-semibold text-sm tracking-widest uppercase mb-1">Pengwin Tech Solutions</p>
                <h1 className="text-3xl font-extrabold tracking-tight">Manager Dashboard</h1>
                <p className="text-blue-200 mt-2">Overview of company attendance and workforce metrics</p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                <FiActivity className="w-8 h-8 text-blue-100" />
              </div>
            </div>
          </div>

          {/* Content Region */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-10 pb-14 md:mt-36">
            {activeView === "dashboard" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="bg-white h-36 rounded-2xl shadow-sm border border-slate-100"></div>)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
                    <MetricCard title="Total Employees" value={data?.totalEmployees} icon={<FiUsers className="text-blue-500" />} color="border-l-blue-500" />
                    <MetricCard title="Present Today" value={data?.presentToday} icon={<FiCheckCircle className="text-emerald-500" />} color="border-l-emerald-500" />
                    <MetricCard title="Absent Today" value={data?.absentToday} icon={<FiXCircle className="text-rose-500" />} color="border-l-rose-500" />
                    <MetricCard title="Leave Today" value={data?.leaveToday} icon={<FiCalendar className="text-amber-500" />} color="border-l-amber-500" />
                    <MetricCard title="Salary Records" value={data?.totalSalaryRecords} icon={<FiDollarSign className="text-purple-500" />} color="border-l-purple-500" />
                  </div>
                )}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mt-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-4 bg-indigo-50 text-indigo-500 rounded-full">
                    <FiActivity className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Welcome to your Dashboard</h3>
                  <p className="text-slate-500 max-w-md">Use the sidebar to navigate between your daily tasks, including employee lifecycle management and system log reviews.</p>
                </div>
              </div>
            )}

            {activeView === "employees" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-16 text-slate-800">
                <EmployeeManager />
              </div>
            )}

            {activeView === "activity" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-16">
                <SystemActivityLogs />
              </div>
            )}

            {activeView === "departments" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-16 text-slate-800">
                <DepartmentManager />
              </div>
            )}
            {activeView === "teams" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-16 text-slate-800">
                <TeamManager />
              </div>
            )}
            {activeView === "projects" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-16 text-slate-800">
                <ProjectManager />
              </div>
            )}
            {activeView === "performance" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-16 text-slate-800">
                <PerformanceManager />
              </div>
            )}
            {activeView === "notifications" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-16 text-slate-800">
                <NotificationCenter />
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MetricCard({ title, value, icon, color }: any) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 ${color} transform hover:-translate-y-1 transition-transform duration-300`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-500 font-medium text-sm">{title}</h3>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-slate-800">{value ?? 0}</p>
    </div>
  );
}