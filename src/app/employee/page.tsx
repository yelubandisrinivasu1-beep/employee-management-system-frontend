"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { FiUser, FiCheckSquare, FiXSquare, FiCoffee, FiCreditCard } from "react-icons/fi";

export default function EmployeeDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/employee-dashboard");
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-white p-3 rounded-2xl shadow-sm">
          <FiUser className="w-6 h-6 text-neutral-700" />
        </div>
        <div>
          <p className="text-emerald-600 font-semibold text-xs tracking-widest uppercase mb-1">Pengwin Tech Solution</p>
          <h1 className="text-3xl font-bold text-neutral-800">My Workspace</h1>
        </div>
      </div>

      {!loading && !data?.profile?.employee && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm">
          <strong>Action Required:</strong> Your user account exists, but the Admin has not yet created your official Employee profile and mapped it to this account. Your metrics will show 0 until this is complete.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 border border-neutral-200">
           <div className="bg-white rounded-3xl p-8 shadow-sm h-full relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-emerald-400 to-teal-500"></div>
             <div className="relative mt-8 text-center">
                <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-md mb-4 flex items-center justify-center">
                   <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl font-bold">
                     {data?.profile?.user?.name?.[0]?.toUpperCase() || "?"}
                   </div>
                </div>
                <h2 className="text-2xl font-bold text-neutral-800">{data?.profile?.user?.name || "Loading..."}</h2>
                <p className="text-neutral-500 mb-6">{data?.profile?.employee?.designation || "Employee"}</p>
                
                <div className="space-y-4 text-left border-t border-neutral-100 pt-6">
                  <div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Department</p>
                    <p className="font-medium text-neutral-700">{data?.profile?.employee?.department || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Email Address</p>
                    <p className="font-medium text-neutral-700">{data?.profile?.user?.email || "N/A"}</p>
                  </div>
                </div>
             </div>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <h2 className="text-xl font-bold text-neutral-800">Summary Dashboard</h2>
           {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
               {[1,2,3,4].map(i => <div key={i} className="bg-white h-32 rounded-3xl border border-neutral-100"></div>)}
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <StatCard title="Present Days" value={data?.summary?.presentDays} icon={<FiCheckSquare />} color="text-emerald-600" bg="bg-emerald-50" />
               <StatCard title="Absent Days" value={data?.summary?.absentDays} icon={<FiXSquare />} color="text-rose-600" bg="bg-rose-50" />
               <StatCard title="Leave Days" value={data?.summary?.leaveDays} icon={<FiCoffee />} color="text-amber-600" bg="bg-amber-50" />
               <StatCard title="Salary Slips" value={data?.summary?.totalSalaryRecords} icon={<FiCreditCard />} color="text-purple-600" bg="bg-purple-50" />
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-2xl ${bg} ${color}`}>
        <div className="scale-150">{icon}</div>
      </div>
      <div>
        <h3 className="text-neutral-500 font-medium text-sm mb-1">{title}</h3>
        <p className="text-3xl font-bold text-neutral-800">{value ?? 0}</p>
      </div>
    </div>
  );
}
