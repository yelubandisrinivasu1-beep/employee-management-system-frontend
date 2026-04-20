"use client";

import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { FiActivity, FiLogIn, FiLogOut } from "react-icons/fi";

export default function EmployeeActivityLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get("/auth/my-logs");
        setLogs(res.data.data);
      } catch (error) {
        console.error("Failed to fetch logs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <div className="text-slate-500 animate-pulse">Loading activity logs...</div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8">
      <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-3">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><FiActivity /></div> 
        My Activity Logs
      </h2>

      {logs.length === 0 ? (
        <div className="text-center py-10 text-neutral-400 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
          No activity logs found.
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log._id} className="flex items-center justify-between p-4 border border-neutral-100 rounded-2xl bg-neutral-50/50 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${log.action === 'login' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {log.action === 'login' ? <FiLogIn /> : <FiLogOut />}
                </div>
                <div>
                  <h4 className="font-bold text-neutral-800 text-sm capitalize">{log.action}</h4>
                  <p className="text-xs text-neutral-500 font-medium mt-1">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-mono text-neutral-400 bg-white px-2 py-1 border border-neutral-100 rounded-md inline-block">IP: {log.ipAddress || "Unknown"}</p>
                <p className="text-xs text-neutral-400 mt-1 truncate max-w-[200px]" title={log.userAgent}>{log.userAgent}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
