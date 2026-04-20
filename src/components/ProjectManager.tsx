"use client";

import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { FiTrash2, FiPlus, FiBox } from "react-icons/fi";

export default function ProjectManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    teamId: "",
    managerId: "",
    status: "planned",
    priority: "medium",
  });

  const fetchData = async () => {
    try {
      const [projRes, teamRes, userRes] = await Promise.all([
        API.get("/projects"),
        API.get("/teams"),
        API.get("/chat/contacts")
      ]);
      setProjects(projRes.data.data);
      setTeams(teamRes.data.data);
      setUsers(userRes.data.data.filter((u:any) => u.role === "manager" || u.role === "admin" || u.role === "technical_manager"));
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
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await API.delete(`/projects/${id}`);
      setProjects(projects.filter((proj: any) => proj._id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete project");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/projects", formData);
      setShowAddForm(false);
      setFormData({ projectName: "", description: "", teamId: "", managerId: "", status: "planned", priority: "medium" });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add project");
    }
  };

  if (loading) return <div className="text-center py-10 animate-pulse">Loading Projects...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FiBox className="text-indigo-600" /> Project Manager
        </h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 text-sm font-medium"
        >
          {showAddForm ? "Cancel" : <><FiPlus /> Add Project</>}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="p-6 border-b border-indigo-100 bg-indigo-50/30 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Project Name</label>
            <input required type="text" value={formData.projectName} onChange={e => setFormData({...formData, projectName: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm" placeholder="e.g. App Redesign" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Team</label>
            <select value={formData.teamId} onChange={e => setFormData({...formData, teamId: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm">
              <option value="">-- Optional --</option>
              {teams.map(t => <option key={t._id} value={t._id}>{t.teamName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Project Manager</label>
            <select required value={formData.managerId} onChange={e => setFormData({...formData, managerId: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm">
              <option value="">-- Select --</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm">
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
            <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 text-sm" placeholder="Optional description" />
          </div>
          <div className="col-span-1 md:col-span-2 flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white rounded-lg px-6 py-2.5 font-medium hover:bg-indigo-700 transition">Save Project</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Team</th>
              <th className="p-4 font-semibold">Manager</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">No projects configured. Add one above.</td></tr>
            ) : (
              projects.map((proj: any) => (
                <tr key={proj._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-4 text-sm font-bold text-slate-800">{proj.projectName}</td>
                  <td className="p-4 text-sm text-slate-600">{proj.teamId?.teamName || "None"}</td>
                  <td className="p-4 text-sm text-slate-600">{proj.managerId?.name || "None"}</td>
                  <td className="p-4 text-sm">
                    <span className={`py-1 px-2 rounded-md text-xs font-medium ${
                      proj.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      proj.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {proj.status.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(proj._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors inline-block" title="Remove Project">
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
