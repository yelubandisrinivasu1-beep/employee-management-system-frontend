"use client";

import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { FiActivity, FiLogIn, FiLogOut, FiMonitor, FiMapPin } from "react-icons/fi";

export default function SystemActivityLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/auth/logs");
      setLogs(res.data.data);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <div className="text-center py-10 animate-pulse bg-slate-50 rounded-2xl">Loading System Logs...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FiActivity className="text-indigo-600" /> System Authentication Logs
        </h2>
        <button onClick={fetchLogs} className="text-sm px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-slate-600 font-medium">
          Refresh
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-center py-10 text-slate-400">No recent authentication activity recorded.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white shadow-sm">
              <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Action</th>
                <th className="p-4 font-semibold hidden md:table-cell">Timestamp</th>
                <th className="p-4 font-semibold hidden lg:table-cell">Device Context</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-800">{log.user?.name || "Deleted User"}</p>
                    <p className="text-xs text-slate-500">{log.user?.email || "N/A"} &bull; <span className="uppercase">{log.user?.role?.replace("_", " ") || "UNKNOWN"}</span></p>
                  </td>
                  <td className="p-4">
                    {log.action === "login" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        <FiLogIn /> LOGIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                        <FiLogOut /> LOGOFF
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-600 hidden md:table-cell">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><FiMapPin className="text-slate-400" /> IP: {log.ipAddress || "Unknown"}</span>
                      {log.userAgent && <span className="flex items-center gap-1 truncate max-w-[200px]" title={log.userAgent}><FiMonitor className="text-slate-400" /> {log.userAgent.split(" ")[0]}</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
