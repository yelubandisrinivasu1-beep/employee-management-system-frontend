"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { FiUsers, FiCheckCircle, FiXCircle, FiCalendar, FiCpu } from "react-icons/fi";

export default function TechnicalManagerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/technical-dashboard");
        setData(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <>
      {data?.totalTeamEmployees === 0 && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/50 rounded-xl text-amber-200 text-sm">
          <strong>Notice:</strong> Your dashboard is empty because no employees have been assigned to you by the Admin yet.
        </div>
      )}
      
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
              {[1,2,3,4].map(i => <div key={i} className="bg-slate-800 h-40 rounded-2xl"></div>)}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <TechCard title="Team Size" value={data?.totalTeamEmployees} icon={<FiUsers />} color="text-indigo-400" bg="bg-indigo-500/10" border="border-indigo-500/20" />
              <TechCard title="Active (Present)" value={data?.presentCount} icon={<FiCheckCircle />} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
              <TechCard title="Offline (Absent)" value={data?.absentCount} icon={<FiXCircle />} color="text-rose-400" bg="bg-rose-500/10" border="border-rose-500/20" />
              <TechCard title="On Leave" value={data?.leaveCount} icon={<FiCalendar />} color="text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
            </div>
        )}
        
        <div className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-2xl flex flex-col items-center justify-center text-center mt-8">
          <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-full mb-4">
              <FiCpu className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Systems Online</h3>
          <p className="text-slate-400 max-w-md text-sm">Use the side navigation to manage your assigned team members, assign new tasks, or review incoming task responses.</p>
        </div>
      </div>
    </>
  );
}

function TechCard({ title, value, icon, color, bg, border }: any) {
  return (
    <div className={`p-6 rounded-2xl border ${border} bg-slate-800/40 relative overflow-hidden group hover:bg-slate-800 transition-colors`}>
      <div className={`absolute -right-6 -top-6 ${color} opacity-5 group-hover:opacity-10 transition-opacity`}>
        <div className="scale-[4]">{icon}</div>
      </div>
      <div className="flex justify-between items-start mb-6 relative">
        <h3 className="text-slate-400 font-medium">{title}</h3>
        <div className={`p-2 rounded-lg ${bg} ${color}`}>{icon}</div>
      </div>
      <p className="text-4xl font-light text-white relative">{value ?? 0}</p>
    </div>
  );
}
