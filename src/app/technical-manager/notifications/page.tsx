"use client";

import NotificationCenter from "@/components/NotificationCenter";

export default function TechnicalManagerNotificationsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-700">
      <div className="text-slate-800 bg-white p-4 rounded-xl">
        <NotificationCenter />
      </div>
    </div>
  );
}
