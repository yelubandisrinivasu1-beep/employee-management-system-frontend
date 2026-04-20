"use client";

import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { FiPlus, FiTrash2, FiCalendar, FiClock } from "react-icons/fi";

type Sprint = {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  tasks: any[];
};

export default function SprintManager() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchSprints = async () => {
    try {
      setLoading(true);
      const res = await API.get("/sprints");
      if (res.data.success) {
        setSprints(res.data.data);
      }
    } catch (err: any) {
      setError("Failed to load sprints.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSprints();
  }, []);

  const handleCreateSprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) return;

    try {
      const res = await API.post("/sprints", { name, startDate, endDate });
      if (res.data.success) {
        setName("");
        setStartDate("");
        setEndDate("");
        fetchSprints();
      }
    } catch (err: any) {
      console.error("Failed to create sprint", err);
      alert(err.response?.data?.message || "Failed to create sprint");
    }
  };

  const handleDeleteSprint = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sprint?")) return;
    try {
      await API.delete(`/sprints/${id}`);
      fetchSprints();
    } catch (err) {
      console.error("Failed to delete sprint", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Sprint Form */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
        <h2 className="text-xl font-bold text-white mb-4">Create New Sprint</h2>
        <form onSubmit={handleCreateSprint} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sprint Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sprint 12"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Start Date</label>
            <input 
              type="date" 
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">End Date</label>
            <input 
              type="date" 
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="md:col-span-1">
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <FiPlus />
              Create Sprint
            </button>
          </div>
        </form>
      </div>

      {/* Sprints List */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Active Sprints</h2>
          <span className="bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full">{sprints.length} Total</span>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading sprints...</div>
        ) : error ? (
          <div className="p-12 text-center text-rose-500">{error}</div>
        ) : sprints.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-700 m-6 rounded-2xl">
            <p className="text-slate-500">No active sprints. Create one above to get started.</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sprints.map(sprint => (
              <div key={sprint._id} className="bg-slate-900/50 p-5 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-white">{sprint.name}</h3>
                  <button onClick={() => handleDeleteSprint(sprint._id)} className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100">
                    <FiTrash2 />
                  </button>
                </div>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-indigo-400" />
                    <span>{new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-emerald-400" />
                    <span>Progress: {sprint.progress || 0}%</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center text-xs font-medium text-slate-500">
                  <span>{sprint.tasks?.length || 0} Tasks Assigned</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
