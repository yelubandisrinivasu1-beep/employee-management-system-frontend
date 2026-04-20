"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { FiHome, FiList, FiActivity, FiCoffee, FiCreditCard, FiStar, FiBell, FiMenu } from "react-icons/fi";
import API from "@/lib/axios";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [data, setData] = useState<any>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: "dashboard", label: "My Workspace", icon: <FiHome />, href: "/employee" },
    { id: "tasks", label: "Task In-Tray", icon: <FiList />, href: "/employee/tasks" },
    { id: "attendance", label: "Attendance", icon: <FiActivity />, href: "/employee/attendance" },
    { id: "leaves", label: "Leaves", icon: <FiCoffee />, href: "/employee/leaves" },
    { id: "payroll", label: "Payroll", icon: <FiCreditCard />, href: "/employee/payroll" },
    { id: "performance", label: "Performance", icon: <FiStar />, href: "/employee/performance" },
    { id: "notifications", label: "Notifications", icon: <FiBell />, href: "/employee/notifications" },
  ];

  // Map pathname to activeView
  let activeView = "dashboard";
  if (pathname.includes("/tasks")) activeView = "tasks";
  if (pathname.includes("/attendance")) activeView = "attendance";
  if (pathname.includes("/leaves")) activeView = "leaves";
  if (pathname.includes("/payroll")) activeView = "payroll";
  if (pathname.includes("/performance")) activeView = "performance";
  if (pathname.includes("/notifications")) activeView = "notifications";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/employee-dashboard");
        setData(res.data.data);
      } catch (error) {
        console.error("Failed to load employee profile");
      }
    };
    fetchProfile();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <div className="flex h-screen overflow-hidden bg-neutral-100 font-sans">
        <Sidebar 
          items={sidebarItems} 
          activeView={activeView} 
          onSelectView={() => {}} // Not used with links
          userName={user?.name || "Employee"}
          userRole={data?.profile?.employee?.designation || "employee"}
          isMobileOpen={isMobileSidebarOpen}
          onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative">
          {/* Mobile Header with Hamburger */}
          <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <FiMenu className="w-5 h-5 text-neutral-700" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || "E"}
              </div>
              <span className="font-medium text-neutral-800">My Workspace</span>
            </div>
          </div>
          
          <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}