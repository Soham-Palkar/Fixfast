import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { User as UserIcon, Wrench } from "lucide-react";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/reports");
      console.log("Reports fetched:", res.data); // Debug log
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch reports error:", err);
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reportId, action) => {
    try {
      // In a more complex app, this would update report status
      // For now, we'll just show success
      toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} action recorded`);
      fetchReports();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-surface-900 tracking-tight">Customer Complaints</h1>
          <p className="text-surface-500 mt-1">Manage and resolve user reports</p>
        </div>
        <div className="bg-brand-50 text-brand-700 px-4 py-2 rounded-2xl font-bold text-sm border border-brand-100">
          {reports.length} Total Reports
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-surface-50 rounded-3xl border-2 border-dashed border-surface-200">
            <div className="text-surface-400 font-medium text-lg">No reports found.</div>
            <p className="text-surface-400 text-sm mt-1">All clear! No pending complaints.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report._id} className="bg-white rounded-3xl border border-surface-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  report.reason === 'Fraud' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {report.reason}
                </span>
                <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">
                  {report.status}
                </span>
              </div>
              
              <h3 className="font-bold text-lg text-surface-900 group-hover:text-brand-600 transition-colors">
                {report.booking?.serviceName || "Global Report"}
              </h3>
              
              <p className="mt-3 text-surface-600 text-sm italic line-clamp-3">
                "{report.description || "No detailed description provided."}"
              </p>

              <div className="mt-6 pt-6 border-t border-surface-50 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-surface-100 flex items-center justify-center text-surface-500">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[10px] leading-tight">
                      <p className="text-surface-400">Reporter</p>
                      <p className="font-bold text-surface-900 truncate max-w-[80px]">{report.user?.fullName || 'User'}</p>
                    </div>
                  </div>
                  
                  <div className="h-8 w-px bg-surface-100"></div>

                  <div className="flex items-center gap-2 text-right">
                    <div className="text-[10px] leading-tight">
                      <p className="text-surface-400">Technician</p>
                      <p className="font-bold text-brand-700 truncate max-w-[80px]">{report.provider?.fullName || 'Technician'}</p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                      <Wrench className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAction(report._id, "resolved")}
                    className="flex-1 rounded-xl bg-brand-50 py-2 text-xs font-bold text-brand-700 hover:bg-brand-600 hover:text-white transition-all shadow-sm"
                  >
                    Resolve ✅
                  </button>
                  <button 
                    onClick={() => handleAction(report._id, "rejected")}
                    className="flex-1 rounded-xl bg-surface-50 py-2 text-xs font-bold text-surface-600 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                  >
                    Reject ❌
                  </button>
                </div>

                <div className="text-[10px] text-surface-400 font-medium pt-2 text-center border-t border-surface-50">
                  {new Date(report.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
