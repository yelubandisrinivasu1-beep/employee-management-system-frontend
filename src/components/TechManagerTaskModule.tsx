"use client";

import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import { io } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

export default function TechManagerTaskModule({ teamEmployees }: { teamEmployees: any[] }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfig, setShowConfig] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    employee: "",
    priority: "medium",
    dueDate: "",
  });

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/technical-manager");
      setTasks(res.data.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    const currentId = user?._id || (user as any)?.id;
    if (currentId) {
      const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000");
      socket.on("connect", () => {
        socket.emit("join", currentId);
      });

      socket.on("task_updated", () => {
        fetchTasks();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/tasks", formData);
      setShowConfig(false);
      setFormData({ title: "", description: "", employee: "", priority: "medium", dueDate: "" });
      fetchTasks();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to assign task");
    }
  };

  if (loading) return <div className="text-slate-500 animate-pulse mt-4">Loading tasks module...</div>;

  return (
    <div className="mt-8 bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div> Task Control Center
        </h2>
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          {showConfig ? "Close" : "Assign New Task"}
        </button>
      </div>

      {showConfig && (
        <form onSubmit={handleCreateTask} className="mb-6 bg-slate-900 border border-slate-700 p-5 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="md:col-span-2">
            <label className="block text-slate-400 mb-1">Task Title <span className="text-rose-500">*</span></label>
            <input required type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-400 mb-1">Description</label>
            <textarea className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Assign To <span className="text-rose-500">*</span></label>
            <select required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white" value={formData.employee} onChange={e=>setFormData({...formData, employee: e.target.value})}>
              <option value="">-- Select Employee --</option>
              {teamEmployees?.map((emp) => (
                <option key={emp._id} value={emp._id}>{emp.user?.name} ({emp.designation})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Priority</label>
            <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white" value={formData.priority} onChange={e=>setFormData({...formData, priority: e.target.value})}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Due Date</label>
            <input type="date" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white" value={formData.dueDate} onChange={e=>setFormData({...formData, dueDate: e.target.value})} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg p-2.5 transition">Deploy Task</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-xs uppercase border-b border-slate-700">
              <th className="pb-3 font-semibold w-1/3">Task</th>
              <th className="pb-3 font-semibold">Assignee</th>
              <th className="pb-3 font-semibold">Priority</th>
              <th className="pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-slate-500">No active tasks deployed to the network.</td></tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                  <td className="py-4">
                    <p className="text-white font-medium text-sm">{task.title}</p>
                    {task.dueDate && <p className="text-xs text-slate-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                    {task.employeeReply && (
                      <div className="mt-2 text-xs bg-indigo-500/10 text-indigo-300 p-2 rounded-md border border-indigo-500/20">
                        <strong className="text-indigo-400">Reply:</strong> {task.employeeReply}
                      </div>
                    )}
                  </td>
                  <td className="py-4 text-sm text-indigo-300">{task.employee?.user?.name || "Unknown"}</td>
                  <td className="py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : task.priority === 'low' ? 'bg-slate-500/10 text-slate-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="flex items-center gap-1.5 text-xs font-semibold">
                      {task.status === "completed" && <><FiCheckCircle className="text-emerald-400"/> <span className="text-emerald-400">COMPLETED</span></>}
                      {task.status === "in_progress" && <><FiClock className="text-amber-400 animate-pulse"/> <span className="text-amber-400">IN PROGRESS</span></>}
                      {task.status === "pending" && <><FiAlertCircle className="text-slate-400"/> <span className="text-slate-400">PENDING</span></>}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
