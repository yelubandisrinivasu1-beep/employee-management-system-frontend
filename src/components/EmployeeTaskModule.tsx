"use client";

import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import { io } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

export default function EmployeeTaskModule() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/my-tasks");
      setTasks(res.data.data);
    } catch (error) {
      console.error("Failed to fetch my tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    const currentId = user?._id || (user as any)?.id;
    if (currentId) {
      const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") );
      socket.on("connect", () => {
        socket.emit("join", currentId);
      });

      socket.on("task_assigned", () => {
        fetchTasks();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update task status.");
    }
  };

  const handleUpdateReply = async (taskId: string) => {
    try {
      const text = replyText[taskId];
      if (!text) return;
      await API.patch(`/tasks/${taskId}/reply`, { reply: text });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, employeeReply: text } : t));
      alert("Reply updated successfully.");
    } catch (err) {
      console.error("Failed to update reply", err);
      alert("Failed to update task reply.");
    }
  };

  if (loading) return <div className="animate-pulse h-20 bg-slate-100 rounded-2xl w-full border border-slate-200"></div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8 h-full">
      <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-3">
        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><FiCheckCircle /></div>
        My Assigned Tasks
      </h2>

      {tasks.length === 0 ? (
        <div className="text-center py-10 text-neutral-400 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
          You currently have no tasks configured in the network.
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task._id} className="p-5 border border-neutral-100 rounded-2xl hover:shadow-md transition-shadow bg-neutral-50/50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-neutral-800 text-lg">{task.title}</h3>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${task.priority === 'high' ? 'bg-rose-100 text-rose-600' : task.priority === 'low' ? 'bg-slate-200 text-slate-600' : 'bg-amber-100 text-amber-600'}`}>
                  {task.priority.toUpperCase()}
                </span>
              </div>
              {task.description && <p className="text-neutral-500 text-sm mb-4">{task.description}</p>}

              <div className="mb-4">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">My Update/Reply</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your progress or reply..."
                    className="flex-1 bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    value={replyText[task._id] !== undefined ? replyText[task._id] : (task.employeeReply || "")}
                    onChange={(e) => setReplyText({ ...replyText, [task._id]: e.target.value })}
                  />
                  <button
                    onClick={() => handleUpdateReply(task._id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Save Reply
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-end mt-4">
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Deadline'}
                </p>
                <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-neutral-100">
                  <button
                    onClick={() => handleUpdateStatus(task._id, "pending")}
                    disabled={task.status === "pending"}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${task.status === 'pending' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    <FiAlertCircle /> Pending
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(task._id, "in_progress")}
                    disabled={task.status === "in_progress"}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${task.status === 'in_progress' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    <FiClock /> In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(task._id, "completed")}
                    disabled={task.status === "completed"}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${task.status === 'completed' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    <FiCheckCircle /> Completed
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
