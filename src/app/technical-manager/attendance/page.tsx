"use client";

export default function TechnicalManagerAttendancePage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-700 text-center">
      <h1 className="text-2xl font-bold text-white mb-2">Team Attendance</h1>
      <p className="text-slate-400">View daily check-ins and check-outs for your team.</p>
      <div className="mt-8 p-12 border-2 border-dashed border-slate-600 rounded-2xl">
        <p className="text-slate-500">Attendance tracking will appear here.</p>
      </div>
    </div>
  );
}
