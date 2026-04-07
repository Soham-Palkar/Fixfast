import React, { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reportData, setReportData] = useState({ reason: "Late", description: "" });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/bookings");
      setBookings(res.data);
    } catch (err) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const res = await api.post("/api/payments/pay", { bookingId: selectedBooking._id });
      toast.success(res.data.message);
      setShowPayModal(false);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  const handleReport = async () => {
    try {
      await api.post("/api/reports", {
        bookingId: selectedBooking._id,
        providerId: selectedBooking.providerId?._id || selectedBooking.providerId,
        reason: reportData.reason,
        description: reportData.description
      });
      toast.success("Report submitted successfully");
      setShowReportModal(false);
      setReportData({ reason: "Late", description: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-brand-100 text-brand-800",
      "otp verified": "bg-brand-100 text-brand-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      declined: "bg-gray-100 text-gray-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) return <div className="p-10 text-center">Loading bookings...</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-10">
      <h1 className="text-2xl md:text-4xl font-black text-gray-900">My Bookings</h1>
      <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-500">Track and manage your service requests</p>

      <div className="mt-8 space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No bookings found.</div>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm transition hover:shadow-md">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate">{booking.serviceName}</h3>
                    <span className={`rounded-full px-3 py-1 text-[10px] md:text-xs font-bold uppercase whitespace-nowrap ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm md:text-base text-gray-600">Technician: <span className="font-semibold">{booking.providerName}</span></p>
                  <p className="mt-2 text-xs md:text-sm text-gray-400 italic">
                    {new Date(booking.createdAt).toLocaleDateString()} at {new Date(booking.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  {booking.status === 'pending' && (
                    <div className="mt-3 flex items-center gap-2 text-brand-700 font-bold bg-brand-50 px-3 py-1.5 rounded-xl inline-block text-xs md:text-sm border border-brand-100">
                      OTP: <span className="text-brand-800 tracking-widest">{booking.otp}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                  <div className="text-xl md:text-2xl font-black text-emerald-600">₹{booking.price}</div>
                  
                  <div className="flex gap-2">
                    {booking.status === 'completed' && (
                      <button 
                        onClick={() => { setSelectedBooking(booking); setShowPayModal(true); }}
                        className="rounded-xl bg-brand-600 px-4 py-2 text-xs md:text-sm font-bold text-white hover:bg-brand-700 shadow-md shadow-brand-100 transition-all flex-1 md:flex-none"
                      >
                        Pay Now ✅
                      </button>
                    )}
                    
                    <button 
                      onClick={() => { setSelectedBooking(booking); setShowReportModal(true); }}
                      className="rounded-xl border border-red-200 px-4 py-2 text-xs md:text-sm font-bold text-red-600 hover:bg-red-50 transition-all flex-1 md:flex-none"
                    >
                      Report ⚠️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-gray-900	">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
            <h2 className="text-2xl font-black ">Secure Payment</h2>
            <p className="mt-2 text-gray-500">Scan QR or click below to simulate</p>
            
            <div className="my-6 flex justify-center">
              <div className="h-48 w-48 rounded-2xl border-4 border-gray-100 bg-gray-50 p-4 flex items-center justify-center">
                {/* Fake QR UI */}
                <div className="grid grid-cols-4 gap-2 opacity-40">
                  {[...Array(16)].map((_, i) => <div key={i} className="h-6 w-6 bg-black rounded-sm" />)}
                </div>
                <div className="absolute font-bold text-gray-300">SCAN ME</div>
              </div>
            </div>
            
            <div className="mb-6 rounded-2xl bg-green-50 p-4">
              <div className="text-sm font-semibold text-green-700">Amount to Pay</div>
              <div className="text-3xl font-black text-green-600">₹{selectedBooking?.price}</div>
            </div>

            <button 
              onClick={handlePayment}
              className="w-full rounded-2xl bg-green-600 py-4 text-lg font-black text-white hover:bg-green-700 shadow-lg shadow-green-200 transition"
            >
              Confirm Mock Payment
            </button>
            <button 
              onClick={() => setShowPayModal(false)}
              className="mt-4 text-sm font-bold text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-gray-900	">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-red-600">Report Issue</h2>
            <p className="mt-1 text-gray-500">Tell us what went wrong with your service.</p>
            
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 uppercase">Reason</label>
                <select 
                  value={reportData.reason}
                  onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                >
                  <option>Late</option>
                  <option>Rude</option>
                  <option>Fraud</option>
                  <option>Overcharge</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-bold text-gray-700 uppercase">Description</label>
                <textarea 
                  value={reportData.description}
                  onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                  placeholder="Tell us more details..."
                  rows="4"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-red-200 resize-none"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setShowReportModal(false)}
                className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-gray-600 hover:bg-gray-200"
              >
                Go Back
              </button>
              <button 
                onClick={handleReport}
                className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white hover:bg-red-700 shadow-md shadow-red-200"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
