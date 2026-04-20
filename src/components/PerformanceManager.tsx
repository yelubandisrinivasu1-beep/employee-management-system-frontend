"use client";

import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { FiStar } from "react-icons/fi";

export default function PerformanceManager() {
  const [performances, setPerformances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/performance");
        setPerformances(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10 animate-pulse">Loading Performance Data...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FiStar className="text-indigo-600" /> Employee Performance Ratings
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Employee</th>
              <th className="p-4 font-semibold">Period</th>
              <th className="p-4 font-semibold">Rating</th>
              <th className="p-4 font-semibold">Task Comp.</th>
              <th className="p-4 font-semibold">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {performances.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">No performance records found.</td></tr>
            ) : (
              performances.map((perf: any) => (
                <tr key={perf._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-4 text-sm font-bold text-slate-800">{perf.employeeId?.name || "Unknown"}</td>
                  <td className="p-4 text-sm text-slate-600">{perf.month} {perf.year}</td>
                  <td className="p-4 text-sm text-amber-500 font-bold">{perf.rating} / 5</td>
                  <td className="p-4 text-sm text-slate-600">{perf.taskCompletionRate}%</td>
                  <td className="p-4 text-sm text-slate-600">{perf.attendanceRate}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
