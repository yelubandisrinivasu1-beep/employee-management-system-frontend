"use client";

import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { FiClock, FiCheckCircle, FiXCircle, FiCalendar } from "react-icons/fi";

export default function EmployeeAttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [todayRecord, setTodayRecord] = useState<any>(null);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await API.get("/attendance/my-attendance");
      const records = res.data.data;
      setAttendance(records);

      // Check if there is a record for today
      const today = new Date().setHours(0, 0, 0, 0);
      const record = records.find((r: any) => {
        const d = new Date(r.date).setHours(0, 0, 0, 0);
        return d === today;
      });
      setTodayRecord(record || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setError("");
    setSuccess("");
    try {
      setActionLoading(true);
      await API.post("/attendance/check-in");
      setSuccess("Checked in successfully!");
      fetchAttendance();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to check in");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setError("");
    setSuccess("");
    try {
      setActionLoading(true);
      await API.post("/attendance/check-out");
      setSuccess("Checked out successfully!");
      fetchAttendance();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to check out");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-800">My Attendance</h1>
        <p className="text-neutral-500">View and track your daily check-ins and check-outs.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8 mb-8 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mt-20 -mr-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full -mb-20 -ml-20 blur-3xl pointer-events-none"></div>

        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shadow-inner mb-6 relative z-10">
          <FiClock className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-bold text-neutral-800 mb-2 relative z-10">Daily Attendance</h2>
        <p className="text-neutral-500 mb-8 relative z-10">Don't forget to check in when you start and check out when you leave.</p>

        {error && <div className="mb-6 p-3 bg-rose-50 text-rose-600 rounded-xl text-sm border border-rose-100 relative z-10">{error}</div>}
        {success && <div className="mb-6 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-sm border border-emerald-100 relative z-10">{success}</div>}

        <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full max-w-md">
          <button
            onClick={handleCheckIn}
            disabled={actionLoading || (todayRecord && todayRecord.checkInTime)}
            className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              (todayRecord && todayRecord.checkInTime)
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200"
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg"
            }`}
          >
            <FiCheckCircle className="w-5 h-5" />
            {(todayRecord && todayRecord.checkInTime) ? "Checked In" : "Check In"}
          </button>

          <button
            onClick={handleCheckOut}
            disabled={actionLoading || !todayRecord || (todayRecord && todayRecord.checkOutTime)}
            className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              !todayRecord || (todayRecord && todayRecord.checkOutTime)
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
            }`}
          >
            <FiXCircle className="w-5 h-5" />
            {(todayRecord && todayRecord.checkOutTime) ? "Checked Out" : "Check Out"}
          </button>
        </div>

        {todayRecord && todayRecord.checkInTime && (
          <div className="mt-6 text-sm text-neutral-600 relative z-10 bg-slate-50 px-6 py-3 rounded-full border border-slate-100">
            You checked in at <strong className="text-slate-800">{new Date(todayRecord.checkInTime).toLocaleTimeString()}</strong>
            {todayRecord.checkOutTime && (
              <> and checked out at <strong className="text-slate-800">{new Date(todayRecord.checkOutTime).toLocaleTimeString()}</strong></>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-6 border-b border-neutral-100 bg-neutral-50 flex items-center gap-2">
          <FiCalendar className="text-indigo-600" />
          <h2 className="text-lg font-semibold text-neutral-800">Attendance History</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : attendance.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border-dashed border-2 border-neutral-100 m-6 rounded-2xl">
            No attendance records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50/50 border-b border-neutral-100 text-sm text-neutral-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Check In</th>
                  <th className="px-6 py-4">Check Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {attendance.map((record) => (
                  <tr key={record._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-neutral-800 font-medium">
                      {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        record.status === 'present' ? 'bg-emerald-100 text-emerald-700' :
                        record.status === 'half_day' ? 'bg-amber-100 text-amber-700' :
                        record.status === 'absent' ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {record.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : "-"}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
