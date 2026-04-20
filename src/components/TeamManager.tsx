"use client";

import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { FiTrash2, FiPlus, FiUsers } from "react-icons/fi";

export default function TeamManager() {
  const [teams, setTeams] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    teamName: "",
    teamLead: "",
    departmentId: "",
    description: "",
    members: [] as string[],
  });

  const fetchData = async () => {
    try {
      const [teamRes, deptRes, userRes] = await Promise.all([
        API.get("/teams"),
        API.get("/departments"),
        API.get("/chat/contacts")
      ]);
      setTeams(teamRes.data.data);
      setDepartments(deptRes.data.data);
      setUsers(userRes.data.data);
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
    if (!confirm("Are you sure you want to delete this team?")) return;
    try {
      await API.delete(`/teams/${id}`);
      setTeams(teams.filter((team: any) => team._id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete team");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/teams", formData);
      setShowAddForm(false);
      setFormData({ teamName: "", teamLead: "", departmentId: "", description: "", members: [] });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add team");
    }
  };

  if (loading) return <div className="text-center py-10 animate-pulse">Loading Teams...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FiUsers className="text-indigo-600" /> Team Manager
        </h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 text-sm font-medium"
        >
          {showAddForm ? "Cancel" : <><FiPlus /> Add Team</>}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="p-6 border-b border-indigo-100 bg-indigo-50/30 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Team Name</label>
            <input required type="text" value={formData.teamName} onChange={e => setFormData({...formData, teamName: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm" placeholder="e.g. Alpha Team" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Department</label>
            <select required value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm">
              <option value="">-- Select --</option>
              {departments.map(d => <option key={d._id} value={d._id}>{d.departmentName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Team Lead</label>
            <select required value={formData.teamLead} onChange={e => setFormData({...formData, teamLead: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm">
              <option value="">-- Select --</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
            <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm" placeholder="Optional description" />
          </div>
          <div className="col-span-1 md:col-span-2 flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white rounded-lg px-6 py-2.5 font-medium hover:bg-indigo-700 transition">Save Team</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Team Name</th>
              <th className="p-4 font-semibold">Department</th>
              <th className="p-4 font-semibold">Lead</th>
              <th className="p-4 font-semibold">Description</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">No teams configured. Add one above.</td></tr>
            ) : (
              teams.map((team: any) => (
                <tr key={team._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-4 text-sm font-bold text-slate-800">{team.teamName}</td>
                  <td className="p-4 text-sm text-slate-600">{team.departmentId?.departmentName || "None"}</td>
                  <td className="p-4 text-sm text-slate-600">{team.teamLead?.name || "None"}</td>
                  <td className="p-4 text-sm text-slate-500">{team.description}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(team._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors inline-block" title="Remove Team">
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
