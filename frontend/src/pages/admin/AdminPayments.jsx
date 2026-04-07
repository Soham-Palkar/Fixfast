import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSettling, setIsSettling] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/transactions");
      setPayments(res.data);
    } catch (err) {
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleSettle = async () => {
    if (!window.confirm("Are you sure you want to process settlements for all technicians?")) return;
    
    try {
      setIsSettling(true);
      const res = await api.post("/api/admin/settle-payments");
      toast.success(res.data.message);
      fetchPayments();
    } catch (err) {
      toast.error("Settlement failed");
    } finally {
      setIsSettling(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-surface-900">Loading transactions...</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-surface-900 border-l-4 border-brand-600 pl-4">Payment & Settlements</h1>
        <button 
          onClick={handleSettle}
          disabled={isSettling}
          className={`rounded-2xl px-6 py-3 font-bold text-white shadow-lg transition ${
            isSettling ? "bg-surface-400 cursor-not-allowed" : "bg-brand-600 hover:bg-brand-700 active:scale-95"
          }`}
        >
          {isSettling ? "Processing..." : "Process Weekly Settlements 💸"}
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-surface-100 bg-white shadow-sm overflow-x-auto whitespace-nowrap">
        <table className="w-full text-left">
          <thead className="bg-brand-50 uppercase text-xs font-bold text-surface-500">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Technician</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {payments.map((p) => (
              <tr key={p._id} className="hover:bg-brand-50/50 transition">
                <td className="px-6 py-4 font-mono text-xs font-bold text-surface-500">{p.transactionId}</td>
                <td className="px-6 py-4 text-surface-900">
                  <div className="font-bold">{p.userId?.fullName}</div>
                  <div className="text-xs text-surface-500">{p.userId?.email}</div>
                </td>
                <td className="px-6 py-4 text-surface-900">
                  <div className="font-bold">{p.technicianId?.fullName}</div>
                  <div className="text-xs text-surface-500">{p.technicianId?.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-lg font-black text-brand-600">₹{p.amount}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase ${
                    p.status === 'settled' ? "bg-brand-100 text-brand-700" : 
                    p.status === 'paid' ? "bg-brand-50 text-brand-600" : 
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-surface-500">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
