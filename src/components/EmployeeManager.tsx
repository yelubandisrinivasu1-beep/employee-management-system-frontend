"use client";

import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { FiTrash2, FiPlus, FiUserPlus } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export default function EmployeeManager() {
  const { user: currentUser } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    employeeId: "",
    department: "",
    designation: "",
    dailySalary: "",
    managerId: "",
    technicalManagerId: "",
  });

  const fetchData = async () => {
    try {
      const [empRes, userRes] = await Promise.all([
        API.get("/employees"),
        API.get("/chat/contacts") // Reusing our contact list endpoint to get users
      ]);
      const combinedUsers = [...userRes.data.data];
      if (currentUser && !combinedUsers.find(u => u._id === (currentUser as any)._id || u._id === (currentUser as any).id)) {
        combinedUsers.push({ _id: (currentUser as any)._id || (currentUser as any).id, name: currentUser.name + " (You)", email: currentUser.email, role: currentUser.role });
      }
      setEmployees(empRes.data.data);
      setUsers(combinedUsers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this employee profile?")) return;
    try {
      await API.delete(`/employees/${id}`);
      setEmployees(employees.filter((emp: any) => emp._id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete employee");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        ...formData,
        dailySalary: Number(formData.dailySalary)
      };
      if (!payload.managerId) delete payload.managerId;
      if (!payload.technicalManagerId) delete payload.technicalManagerId;

      await API.post("/employees", payload);
      setShowAddForm(false);
      setFormData({ name: "", email: "", password: "", employeeId: "", department: "", designation: "", dailySalary: "", managerId: "", technicalManagerId: "" });
      fetchData(); // Refresh list
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add employee");
    }
  };

  if (loading) return <div className="text-center py-10 animate-pulse">Loading Roster...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FiUserPlus className="text-indigo-600" /> Employee Roster
        </h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 text-sm font-medium"
        >
          {showAddForm ? "Cancel" : <><FiPlus /> Add Employee</>}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="p-6 border-b border-indigo-100 bg-indigo-50/30 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2 mb-1 pb-3 border-b border-indigo-200/50">
            <h3 className="text-sm font-bold text-indigo-900">New User Login Details</h3>
            <p className="text-xs text-indigo-700/70 mb-3">These credentials will be used by the employee to log in.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                <input required type="text" minLength={3} pattern="[a-zA-Z\s]+" title="Name should only contain letters and spaces" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Company Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm" placeholder="e.g. john@pengwin.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Temporary Password</label>
                <input required type="text" minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm" placeholder="Min 6 characters" />
              </div>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-bold text-indigo-900 mb-0">Employment Details</h3>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Employee ID</label>
            <input required type="text" pattern="[A-Za-z0-9_-]+" title="Alphanumeric characters, hyphens, and underscores only" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm" placeholder="e.g. EMP001" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Department</label>
            <input required type="text" minLength={2} value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm" placeholder="e.g. Software Development" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Designation</label>
            <input required type="text" minLength={2} value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm" placeholder="e.g. Frontend Dev" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Daily Salary ($)</label>
            <input required type="number" min="0" step="0.01" value={formData.dailySalary} onChange={e => setFormData({...formData, dailySalary: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm" placeholder="Amount" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Select Manager</label>
            <select 
              value={formData.managerId} 
              onChange={e => setFormData({...formData, managerId: e.target.value})}
              className="w-full border-slate-200 rounded-lg p-2.5 text-sm"
            >
              <option value="">-- Optional --</option>
              {users.filter(u => u.role === "manager" || u.role === "admin").map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Select Tech Manager</label>
            <select 
              value={formData.technicalManagerId} 
              onChange={e => setFormData({...formData, technicalManagerId: e.target.value})}
              className="w-full border-slate-200 rounded-lg p-2.5 text-sm"
            >
              <option value="">-- Optional --</option>
              {users.filter(u => u.role === "technical_manager" || u.role === "admin").map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-indigo-600 text-white rounded-lg p-2.5 font-medium hover:bg-indigo-700 transition">Create Profile</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Emp ID</th>
              <th className="p-4 font-semibold">Name / Email</th>
              <th className="p-4 font-semibold">Department</th>
              <th className="p-4 font-semibold">Designation</th>
              <th className="p-4 font-semibold border-l pl-4">Reports To</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">No employees configured. Add one above.</td></tr>
            ) : (
              employees.map((emp: any) => (
                <tr key={emp._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-4 text-sm font-medium text-slate-700">{emp.employeeId}</td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-800">{emp.user?.name}</p>
                    <p className="text-xs text-slate-500">{emp.user?.email}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{emp.department}</td>
                  <td className="p-4 text-sm text-slate-600 border"><span className="bg-indigo-50 text-indigo-700 py-1 px-2 rounded-md text-xs font-medium">{emp.designation}</span></td>
                  <td className="p-4 text-xs text-slate-500 border-l pl-4">
                    <span className="font-semibold">M:</span> {emp.managerId?.name || "None"}<br/>
                    <span className="font-semibold">TM:</span> {emp.technicalManagerId?.name || "None"}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(emp._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors inline-block" title="Remove Employee">
                      <FiTrash2 />
                    </button>
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
