"use client";

import PerformanceManager from "@/components/PerformanceManager";

export default function TechnicalManagerPerformancePage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-700">
      <h1 className="text-2xl font-bold text-white mb-6">Team Performance</h1>
      <div className="text-slate-800 bg-white p-4 rounded-xl">
        <PerformanceManager />
      </div>
    </div>
  );
}
