import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function AdminTechnicians() {
  const [techs, setTechs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [banDays, setBanDays] = useState(7);

  useEffect(() => {
    fetchTechs();
  }, []);

  const fetchTechs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/technicians");
      setTechs(res.data);
    } catch (err) {
      toast.error("Failed to fetch technicians");
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async () => {
    try {
      await api.post("/api/admin/ban-technician", {
        technicianId: selectedTech._id,
        days: banDays
      });
      toast.success("Technician banned");
      setShowBanModal(false);
      fetchTechs();
    } catch (err) {
      toast.error("Failed to ban technician");
    }
  };

  const handleWarn = async (techId) => {
    try {
      const res = await api.post("/api/admin/warn-technician", { technicianId: techId });
      toast.success(res.data.message || "Warning sent to technician");
      fetchTechs();
    } catch (err) {
      toast.error("Failed to send warning");
    }
  };

  const handleUnban = async (techId) => {
    try {
      await api.post("/api/admin/unban-technician", { technicianId: techId });
      toast.success("Technician unbanned and restored to active");
      fetchTechs();
    } catch (err) {
      toast.error("Failed to unban technician");
    }
  };

  const handleClearFlag = async (techId) => {
    try {
      await api.post("/api/admin/clear-flag", { technicianId: techId });
      toast.success("Flag cleared successfully");
      fetchTechs();
    } catch (err) {
      toast.error("Failed to clear flag");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading technicians...</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-black text-surface-900 border-l-4 border-brand-600 pl-4">Technician Management</h1>
      
      <div className="mt-6 md:mt-8 overflow-hidden rounded-2xl md:rounded-3xl border border-surface-100 bg-white shadow-sm overflow-x-auto no-scrollbar">
        <table className="w-full text-left min-w-[800px] md:min-w-full">
          <thead className="bg-brand-50 uppercase text-[10px] md:text-xs font-bold text-surface-500">
            <tr>
              <th className="px-4 md:px-6 py-3 md:py-4">Technician</th>
              <th className="px-4 md:px-6 py-3 md:py-4">Rating</th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-center">Flags</th>
              <th className="px-4 md:px-6 py-3 md:py-4">Verified</th>
              <th className="px-4 md:px-6 py-3 md:py-4">Status</th>
              <th className="px-4 md:px-6 py-3 md:py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 whitespace-nowrap text-sm md:text-base">
            {techs.map((tech) => (
              <tr key={tech._id} className="hover:bg-brand-50/50 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-surface-900">{tech.fullName}</div>
                  <div className="text-sm text-surface-500">{tech.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    ⭐ {Number(tech.rating || 0).toFixed(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`inline-block rounded-full px-3 py-1 font-bold text-xs uppercase ${tech.warningCount > 0 ? "bg-amber-50 text-amber-600" : "bg-surface-50 text-surface-400"}`}>
                      Warnings: {tech.warningCount || 0}
                    </span>
                    <span className={`inline-block rounded-full px-3 py-1 font-bold text-xs uppercase ${tech.complaintCount > 0 ? "bg-red-50 text-red-600" : "bg-surface-50 text-surface-400"}`}>
                      Reports: {tech.complaintCount || 0}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {tech.isVerified ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                      ✅ Yes
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                      ❌ No
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase ${
                    tech.status === 'active' ? "bg-green-100 text-green-700" : 
                    tech.status === 'flagged' ? "bg-yellow-100 text-yellow-700" : 
                    "bg-red-100 text-red-700"
                  }`}>
                    {tech.status}
                  </span>
                  {tech.status === 'banned' && tech.banUntil && (
                    <div className="mt-1 text-[10px] font-bold text-red-500 uppercase tracking-tighter">
                      Until: {new Date(tech.banUntil).toLocaleDateString()}
                    </div>
                  )}
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleWarn(tech._id)}
                      className="rounded-lg bg-yellow-50 px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-bold text-yellow-700 hover:bg-yellow-100"
                    >
                      Warn
                    </button>
                    {tech.status !== 'banned' ? (
                      <button 
                        onClick={() => { setSelectedTech(tech); setShowBanModal(true); }}
                        className="flex items-center gap-1 rounded-lg bg-red-100 px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-bold text-red-700 hover:bg-red-200"
                      >
                        🚫 Ban
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleUnban(tech._id)}
                        className="flex items-center gap-1 rounded-lg bg-brand-100 px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-bold text-brand-700 hover:bg-brand-200"
                      >
                        🔓 Unban
                      </button>
                    )}
                    {tech.status === 'flagged' && (
                      <button 
                        onClick={() => handleClearFlag(tech._id)}
                        className="rounded-lg bg-brand-50 px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-bold text-brand-700 hover:bg-brand-100"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ban Modal */}
      {showBanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 text-surface-900">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-red-600">Ban Technician</h2>
            <p className="mt-2 text-surface-500">How many days should this ban last?</p>
            
            <div className="mt-6">
              <input 
                type="number"
                value={banDays}
                onChange={(e) => setBanDays(e.target.value)}
                className="w-full rounded-xl border border-surface-200 px-4 py-3 text-center text-xl font-bold outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setShowBanModal(false)}
                className="flex-1 rounded-xl bg-surface-100 py-3 font-bold text-surface-600 hover:bg-surface-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleBan}
                className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white hover:bg-red-700 shadow-md shadow-red-200"
              >
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
