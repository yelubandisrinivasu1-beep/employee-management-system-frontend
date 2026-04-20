"use client";

import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { FiTrash2, FiPlus, FiBriefcase } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export default function DepartmentManager() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    departmentName: "",
    departmentCode: "",
    description: "",
    managerId: "",
  });

  const fetchData = async () => {
    try {
      const [deptRes, userRes] = await Promise.all([
        API.get("/departments"),
        API.get("/chat/contacts") // Reusing contact list for users
      ]);
      setDepartments(deptRes.data.data);
      // Filter for managers and admins
      setManagers(userRes.data.data.filter((u: any) => u.role === "manager" || u.role === "admin"));
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
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      await API.delete(`/departments/${id}`);
      setDepartments(departments.filter((dept: any) => dept._id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete department");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { ...formData };
      if (!payload.managerId) delete payload.managerId;
      await API.post("/departments", payload);
      setShowAddForm(false);
      setFormData({ departmentName: "", departmentCode: "", description: "", managerId: "" });
      fetchData(); // Refresh list
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add department");
    }
  };

  if (loading) return <div className="text-center py-10 animate-pulse">Loading Departments...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FiBriefcase className="text-indigo-600" /> Department Manager
        </h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 text-sm font-medium"
        >
          {showAddForm ? "Cancel" : <><FiPlus /> Add Department</>}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="p-6 border-b border-indigo-100 bg-indigo-50/30 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Department Name</label>
            <input required type="text" minLength={2} value={formData.departmentName} onChange={e => setFormData({...formData, departmentName: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm" placeholder="e.g. Software Development" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Department Code</label>
            <input required type="text" pattern="[A-Za-z0-9]+" title="Only alphanumeric characters without spaces" value={formData.departmentCode} onChange={e => setFormData({...formData, departmentCode: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm" placeholder="e.g. DEV" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
            <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm" placeholder="Optional description" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Department Head</label>
            <select 
              value={formData.managerId} 
              onChange={e => setFormData({...formData, managerId: e.target.value})}
              className="w-full border-slate-200 rounded-lg p-2.5 text-sm"
            >
              <option value="">-- Optional --</option>
              {managers.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <div className="col-span-1 md:col-span-2 flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white rounded-lg px-6 py-2.5 font-medium hover:bg-indigo-700 transition">Save Department</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Code</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Head</th>
              <th className="p-4 font-semibold">Description</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">No departments configured. Add one above.</td></tr>
            ) : (
              departments.map((dept: any) => (
                <tr key={dept._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-4 text-sm font-medium text-slate-700">{dept.departmentCode}</td>
                  <td className="p-4 text-sm font-bold text-slate-800">{dept.departmentName}</td>
                  <td className="p-4 text-sm text-slate-600">{dept.managerId?.name || "None"}</td>
                  <td className="p-4 text-sm text-slate-500">{dept.description}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(dept._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors inline-block" title="Remove Department">
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
