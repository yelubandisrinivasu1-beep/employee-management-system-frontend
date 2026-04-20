"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";

export interface SidebarItem {
  icon: ReactNode;
  label: string;
  id: string; // Used to identify which view is selected
  href?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  activeView: string;
  onSelectView: (id: string) => void;
  userName: string;
  userRole: string;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export default function Sidebar({ items, activeView, onSelectView, userName, userRole, isMobileOpen = false, onMobileToggle }: SidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleItemClick = (id: string) => {
    onSelectView(id);
    if (window.innerWidth < 768 && onMobileToggle) {
      onMobileToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar - Pure Tailwind Media Queries */}
      <aside className={`bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-screen z-50 w-64 transition-transform duration-300 ease-in-out absolute md:sticky md:top-0 left-0 top-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-600/20">
                {userName ? userName.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-white font-bold truncate">{userName || "User"}</h2>
                <p className="text-xs text-slate-400 capitalize truncate">{userRole?.replace("_", " ") || "Role"}</p>
              </div>
            </div>
            {/* Mobile close button */}
            <button
              onClick={onMobileToggle}
              className="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors md:hidden"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Navigation</p>
          {items.map((item) => {
            const isActive = activeView === item.id;
            const className = `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive 
                ? "bg-indigo-600/10 text-indigo-400 font-medium" 
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`;
            
            if (item.href) {
              return (
                <Link key={item.id} href={item.href} className={className} onClick={() => {
                  if (window.innerWidth < 768 && onMobileToggle) {
                    onMobileToggle();
                  }
                }}>
                  <div className={isActive ? "text-indigo-400" : "text-slate-500"}>
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={className}
              >
                <div className={isActive ? "text-indigo-400" : "text-slate-500"}>
                  {item.icon}
                </div>
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 mb-4 cursor-pointer"
          >
            <FiLogOut />
            <span className="text-sm font-medium">Log Out</span>
          </button>
          <div className="bg-slate-800/50 rounded-xl p-4 text-xs text-slate-400 text-center">
            Pengwin Tech Solutions
            <p className="mt-1 opacity-50">Enterprise Portal v2.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}

