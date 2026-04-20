"use client";

import SprintManager from "@/components/SprintManager";

export default function TechnicalManagerSprintsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Sprint Management</h1>
        <p className="text-slate-400">Create sprints, assign tasks, and track progress.</p>
      </div>
      <SprintManager />
    </div>
  );
}
