"use client";

import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { FiBell, FiCheck } from "react-icons/fi";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put(`/notifications/mark-all-read`);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-center py-10 animate-pulse">Loading Notifications...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-3xl mx-auto">
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FiBell className="text-indigo-600" /> Notifications
        </h2>
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={markAllAsRead}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400">You have no notifications.</div>
        ) : (
          notifications.map((notif: any) => (
            <div key={notif._id} className={`p-4 flex justify-between items-start ${notif.isRead ? 'bg-white' : 'bg-indigo-50/30'}`}>
              <div>
                <h4 className={`text-sm font-semibold ${notif.isRead ? 'text-slate-600' : 'text-slate-900'}`}>{notif.title}</h4>
                <p className={`text-sm mt-1 ${notif.isRead ? 'text-slate-500' : 'text-slate-700'}`}>{notif.message}</p>
                <p className="text-xs text-slate-400 mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
              </div>
              {!notif.isRead && (
                <button onClick={() => markAsRead(notif._id)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition" title="Mark as read">
                  <FiCheck />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
