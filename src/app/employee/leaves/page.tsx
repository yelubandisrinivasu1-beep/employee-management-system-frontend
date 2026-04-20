"use client";

import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { FiCalendar, FiClock, FiCheck, FiX, FiPlus } from "react-icons/fi";

export default function EmployeeLeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await API.get("/leaves/my-leaves");
      setLeaves(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fromDate || !toDate || !reason) {
      setError("Please fill all fields");
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/leaves", { fromDate, toDate, reason });
      setFromDate("");
      setToDate("");
      setReason("");
      setShowForm(false);
      fetchLeaves();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit leave request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Leave Management</h1>
          <p className="text-neutral-500">Apply for leave and view your leave balance.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
        >
          {showForm ? <FiX /> : <FiPlus />}
          {showForm ? "Cancel" : "Apply Leave"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">New Leave Request</h2>
          {error && <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-xl text-sm border border-rose-100">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">From Date</label>
                <input 
                  type="date" 
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">To Date</label>
                <input 
                  type="date" 
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Reason</label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                placeholder="Please describe the reason for your leave..."
                required
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-6 border-b border-neutral-100 bg-neutral-50">
          <h2 className="text-lg font-semibold text-neutral-800">Leave History</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : leaves.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border-dashed border-2 border-neutral-100 m-6 rounded-2xl">
            You have not submitted any leave requests yet.
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {leaves.map((leave) => (
              <li key={leave._id} className="p-6 hover:bg-neutral-50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      leave.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      leave.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {leave.status}
                    </span>
                    <span className="text-sm text-neutral-400 flex items-center gap-1">
                      <FiClock /> Applied {new Date(leave.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-neutral-800 text-lg flex items-center gap-2 mt-1">
                    <FiCalendar className="text-indigo-500" />
                    {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                  </h3>
                  <p className="text-sm text-neutral-600 mt-2 bg-white border border-neutral-100 p-3 rounded-xl inline-block shadow-sm">
                    {leave.reason}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
