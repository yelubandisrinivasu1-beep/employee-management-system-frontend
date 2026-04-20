"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { FiCheck, FiX, FiCalendar, FiClock, FiUser } from "react-icons/fi";

export default function LeaveManager() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await API.get("/leaves");
      setLeaves(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await API.patch(`/leaves/${id}/status`, { status });
      fetchLeaves();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FiCalendar className="text-indigo-600" /> Leave Approvals
          </h2>
          <p className="text-sm text-slate-500 mt-1">Review and manage employee leave requests.</p>
        </div>
      </div>

      <div className="p-0">
        {leaves.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No leave requests found.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {leaves.map((leave) => (
              <li key={leave._id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                    {leave.employee?.user?.name?.charAt(0) || <FiUser />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">{leave.employee?.user?.name || "Unknown Employee"}</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><FiCalendar className="w-4 h-4" /> {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><FiClock className="w-4 h-4" /> Applied: {new Date(leave.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-3 bg-white border border-slate-100 p-3 rounded-xl text-sm text-slate-600 shadow-sm">
                      <span className="font-medium text-slate-700">Reason:</span> {leave.reason}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 min-w-[140px] shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    leave.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    leave.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {leave.status}
                  </span>

                  {leave.status === "pending" && (
                    <div className="flex gap-2 w-full mt-2">
                      <button 
                        onClick={() => updateStatus(leave._id, "approved")}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg font-medium transition-colors cursor-pointer border border-emerald-200 hover:border-emerald-500 shadow-sm"
                      >
                        <FiCheck /> Approve
                      </button>
                      <button 
                        onClick={() => updateStatus(leave._id, "rejected")}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg font-medium transition-colors cursor-pointer border border-rose-200 hover:border-rose-500 shadow-sm"
                      >
                        <FiX /> Decline
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
