import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CircleDollarSign, Wrench, Siren, Flag } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/api/admin/stats");
      setStats(res.data);
    } catch (err) {
      toast.error("Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Admin Dashboard...</div>;

  const statCards = [
    { label: "Total Revenue", value: `₹${stats?.totalRevenue || 0}`, color: "text-green-600", bg: "bg-green-50" },
    { label: "Net Profits", value: `₹${stats?.totalProfit || 0}`, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "Pending Payouts", value: `₹${stats?.pendingSettlements || 0}`, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Flagged Techs", value: stats?.flaggedTechnicians || 0, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900 border-l-4 border-brand-600 pl-4">Admin Dashboard</h1>
        <button 
          onClick={fetchStats}
          className="rounded-xl bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 whitespace-nowrap	">
        {statCards.map((card, i) => (
          <div key={i} className={`rounded-3xl ${card.bg} p-6 shadow-sm border border-black/5`}>
            <div className="text-sm font-bold uppercase tracking-wider text-gray-500">{card.label}</div>
            <div className={`mt-2 text-3xl font-black ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-900">Admin Actions</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Link to="/admin/payments" className="flex flex-col items-center justify-center rounded-2xl bg-brand-50 p-6 text-center transition hover:bg-brand-100 group">
              <CircleDollarSign className="h-8 w-8 mb-2 text-brand-600 group-hover:scale-110 transition" />
              <span className="font-bold text-brand-700">Settle Payments</span>
            </Link>
            <Link to="/admin/technicians" className="flex flex-col items-center justify-center rounded-2xl bg-orange-50 p-6 text-center transition hover:bg-orange-100 group">
              <Wrench className="h-8 w-8 mb-2 text-orange-600 group-hover:scale-110 transition" />
              <span className="font-bold text-orange-700">Manage Techs</span>
            </Link>
            <Link to="/admin/reports" className="flex flex-col items-center justify-center rounded-2xl bg-red-50 p-6 text-center transition hover:bg-red-100 group">
              <Siren className="h-8 w-8 mb-2 text-red-600 group-hover:scale-110 transition" />
              <span className="font-bold text-red-700">Review Reports</span>
            </Link>
            <Link to="/admin/flagged" className="flex flex-col items-center justify-center rounded-2xl bg-yellow-50 p-6 text-center transition hover:bg-yellow-100 group">
              <Flag className="h-8 w-8 mb-2 text-yellow-600 group-hover:scale-110 transition" />
              <span className="font-bold text-yellow-700">Flagged Cases</span>
            </Link>
          </div>
        </div>

        {/* System Health / Tips */}
        <div className="rounded-3xl border border-brand-100 bg-brand-600 p-8 text-white shadow-xl">
          <h2 className="text-xl font-black">System Insights</h2>
          <p className="mt-4 opacity-80">Welcome to the FixFast command center. Monitor activity and ensure smooth operations.</p>
          
          <ul className="mt-6 space-y-4">
            <li className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">✓</div>
              <span className="font-medium">Total technicians: {stats?.activeTechnicians + stats?.bannedTechnicians + stats?.flaggedTechnicians}</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">✓</div>
              <span className="font-medium">Active sessions: Live</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">✓</div>
              <span className="font-medium">Automatic flagging enabled</span>
            </li>
          </ul>
          
          <div className="mt-8">
            <Link to="/" className="rounded-xl bg-white px-6 py-3 font-bold text-brand-600 hover:bg-brand-50">
              View Public Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
