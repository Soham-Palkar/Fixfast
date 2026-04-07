import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import { Card, CardContent, CardFooter } from "../components/ui/Card.jsx";
import { Calendar, Phone, MapPin, Search, Star, MessageSquare, IndianRupee, Map as MapIcon, XCircle, ShieldAlert, CheckCircle2 } from "lucide-react";
export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [reviewForms, setReviewForms] = useState({});
  const [reviewSubmitted, setReviewSubmitted] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [reportingBooking, setReportingBooking] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();

    const onFocus = () => loadBookings();
    const onStorage = () => loadBookings();

    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);

    const interval = setInterval(() => {
      loadBookings();
    }, 5000);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      loadUnreadCounts();
    }
  }, [bookings]);

  const filteredBookings = bookings.filter(b => {
    const isReviewed = b.userRating || b.userFeedback || b.userReport;

    if (showHistory) {
      return (
        ["cancelled", "declined"].includes(b.status) ||
        (b.status === "completed" && isReviewed)
      );
    } else {
      return (
        ["pending", "accepted", "otp verified"].includes(b.status) ||
        (b.status === "completed" && !isReviewed)
      );
    }
  });

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem('fixfast_token');
      const currentUser = JSON.parse(
        localStorage.getItem("fixfast_current_user") || "null"
      );

      if (!token || !currentUser) {
        setBookings([]);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        console.error('Failed to load bookings');
        setBookings([]);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('fixfast_token');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      await loadBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking', {
        icon: "⚠️",
        style: {
          borderLeft: "5px solid #ef4444",
        },
      });
    }
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('fixfast_token');
      if (!selectedBooking) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId: selectedBooking._id })
      });
      
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Payment successful!");
        setShowPayModal(false);
        await loadBookings();
      } else {
        toast.error(data.message || "Payment failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed. Please try again.");
    }
  };

  const submitReview = async (bookingId) => {
    const form = reviewForms[bookingId] || {};
    const rating = Number(form.rating || 0);
    const feedback = (form.feedback || "").trim();
    const report = (form.report || "").trim();
    const reason = form.reason || "Other";

    if (!rating && !feedback && !report) {
      toast.error("Please provide rating, feedback, or report");
      return;
    }

    const booking = bookings.find(b => b._id === bookingId);
    if (booking && booking.paymentStatus !== 'paid') {
      toast.error("Payment is compulsory before submitting feedback.");
      return;
    }

    if (rating && (rating < 1 || rating > 5)) {
      alert("Rating must be between 1 and 5.");
      return;
    }

    try {
      const token = localStorage.getItem('fixfast_token');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          rating: rating || null, 
          feedback: feedback || "" 
        })
      });
      
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || 'Failed to submit review';
        throw new Error(errorMessage);
      }
      // ✅ SEND REPORT SEPARATELY
      if (report) {
  const booking = bookings.find(b => b._id === bookingId);

  await fetch(`${import.meta.env.VITE_API_URL}/api/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      providerId: booking.providerId?._id || booking.providerId,
      bookingId,
      reason,
      description: report,
    }),
  });
}

      await loadBookings();
      setReviewSubmitted(prev => ({ ...prev, [bookingId]: true }));
      toast.success("Review submitted successfully", {
        icon: "🎉",
        style: {
          borderLeft: "5px solid #22c55e",
        },
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review', {
        icon: "❌",
        style: {
          borderLeft: "5px solid #ef4444",
        },
      });
    }
  };

  const handleFormChange = (bookingId, field, value) => {
    setReviewForms((prev) => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        [field]: value,
      },
    }));
  };

  const loadUnreadCounts = async () => {
    try {
      const token = localStorage.getItem('fixfast_token');
      if (!token) return;

      const counts = {};
      
      for (const booking of bookings) {
        if (["accepted", "otp verified", "completed"].includes(booking.status)) {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/${booking._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.ok) {
            const messages = await response.json();
            const unreadCount = messages.filter(msg => 
              msg.isRead === false && msg.senderType === 'provider'
            ).length;
            counts[booking._id] = unreadCount;
            console.log(`Booking ${booking._id} unread count:`, unreadCount); // Debug
          }
        }
      }
      
      setUnreadCounts(counts);
      console.log("All unread counts:", counts); // Debug
    } catch (error) {
      console.error('Error loading unread counts:', error);
    }
  };


  const getBadgeVariant = (status) => {
    switch (status) {
      case "pending": return "warning";
      case "accepted": return "success";
      case "cancelled": return "danger";
      case "otp verified": return "primary";
      case "completed": return "success";
      case "declined": return "danger";
      default: return "secondary";
    }
  };

  const getStatusMessage = (status, location) => {
    switch (status) {
      case "pending":
        return <p className="mt-1 text-sm text-surface-500">Waiting for provider response.</p>;
      case "accepted":
        return (
          <div className="mt-1">
            <p className="text-sm font-medium text-brand-600">Provider accepted request.</p>
            {location && (
              <p className="mt-1 text-xs text-surface-500">
                Last updated: {new Date(location.updatedAt).toLocaleTimeString()}
              </p>
            )}
          </div>
        );
      case "cancelled":
        return <p className="mt-1 text-sm font-medium text-red-600">Booking was cancelled.</p>;
      case "otp verified":
        return <p className="mt-1 text-sm font-medium text-purple-600">Service in progress.</p>;
      case "completed":
        return <p className="mt-1 text-sm font-medium text-green-600">Service completed successfully.</p>;
      case "declined":
        return <p className="mt-1 text-sm font-medium text-red-600">Provider declined request.</p>;
      default:
        return <p className="mt-1 text-sm text-surface-500">Status unavailable.</p>;
    }
  };

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in relative z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 blur-3xl rounded-full pointer-events-none -z-10" />
        
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-surface-900">My Bookings</h1>
            <p className="mt-2 text-lg text-surface-600 font-medium">
              Manage your active service requests and track history.
            </p>
          </div>
          <div className="flex bg-surface-100/80 p-1.5 rounded-2xl w-fit backdrop-blur-sm border border-surface-200/50">
            <button
              onClick={() => setShowHistory(false)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                !showHistory ? "bg-white text-brand-700 shadow-sm" : "text-surface-500 hover:text-surface-900 hover:bg-surface-200/50"
              }`}
            >
              Active Jobs
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                showHistory ? "bg-white text-brand-700 shadow-sm" : "text-surface-500 hover:text-surface-900 hover:bg-surface-200/50"
              }`}
            >
              Past History
            </button>
          </div>
        </div>

        {bookings.length === 0 ? (
          <Card className="p-16 text-center border-dashed border-2 border-brand-200 bg-brand-50/30 rounded-[2rem]">
            <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-brand-100">
               <Calendar className="w-10 h-10 text-brand-400" />
            </div>
            <h3 className="text-2xl font-black text-surface-900">No bookings yet</h3>
            <p className="text-surface-500 mt-2 text-lg">Ready to get some work done around the house?</p>
            <Button
              onClick={() => navigate("/services")}
              className="mt-8 px-8 py-4 text-base font-bold bg-brand-600 shadow-lg shadow-brand-500/20 rounded-xl"
            >
              Browse Services
            </Button>
          </Card>
        ) : (
          <>
            {filteredBookings.length === 0 && (
              <div className="mt-8 text-center p-16 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-surface-200 shadow-sm text-surface-500 font-bold text-xl">
                {!showHistory ? "No active bookings at the moment." : "No past bookings found."}
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
              {filteredBookings.map((b) => (
                <Card key={b._id} hover className="flex flex-col border-none shadow-soft hover:shadow-2xl transition-shadow bg-white rounded-[2rem] overflow-hidden">
                  {/* HEADER */}
                  <CardContent className="p-8 flex-1">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-surface-900 leading-tight">
                          {b.serviceName}
                        </h3>
                        <p className="text-sm text-surface-500 mt-1.5 font-medium flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {new Date(b.createdAt || b.date).toLocaleString(undefined, {
                            dateStyle: "medium", timeStyle: "short"
                          })}
                        </p>
                      </div>
                      <Badge variant={getBadgeVariant(b.status)} className="uppercase text-[10px] sm:text-xs font-black tracking-widest px-3 py-1.5 shadow-sm rounded-lg">
                        {b.status}
                      </Badge>
                    </div>

                    <div className="space-y-6">
                      {/* TECHNICIAN DETAILS */}
                      <div className="bg-surface-50/80 rounded-2xl p-5 border border-surface-100 flex flex-col gap-3">
                         {b.providerName ? (
                           <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-surface-100 shadow-sm">
                             <div className="text-sm font-bold text-surface-400 uppercase tracking-wider">Assigned Pro</div>
                             <div className="text-sm font-black text-brand-700 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {b.providerName}</div>
                           </div>
                         ) : (
                           <div className="text-sm font-bold tracking-wide text-brand-600 bg-brand-50 p-3 rounded-xl border border-brand-100 flex items-center justify-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div> Looking for nearby providers...
                           </div>
                         )}
                         
                         {b.providerId?.phone && (
                           <div className="flex justify-between items-center px-2">
                             <div className="text-sm font-medium text-surface-500 flex items-center gap-1.5"><Phone className="w-4 h-4" /> Contact</div>
                             <div className="text-sm font-bold text-surface-800">{b.providerId.phone}</div>
                           </div>
                         )}
                         <div className="pt-3 border-t border-surface-200/60 mt-1 px-2">
                           {getStatusMessage(b.status, b.providerLocation)}
                         </div>
                      </div>

                      {/* OTP SECTION */}
                      {b.status === "accepted" && !b.otpVerified && (
                        <div className="p-6 rounded-2xl relative overflow-hidden bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-100 text-center shadow-inner">
                          <p className="text-xs font-black text-brand-700 uppercase tracking-[0.15em] mb-2">
                            Share this PIN with provider
                          </p>
                          <div className="inline-block bg-white px-6 py-2 rounded-xl shadow-sm border border-brand-100">
                             <p className="text-4xl font-black tracking-[0.25em] text-surface-900 font-mono">
                               {b.otp || "----"}
                             </p>
                          </div>
                        </div>
                      )}

                      {/* MAP SECTION (ALWAYS INLINE WHEN ACTIVE) */}
                      {(b.status === "accepted" || b.status === "otp verified") && b.providerLocation && (
                        <div className="rounded-2xl overflow-hidden border-2 border-brand-100 shadow-md h-64 relative group animate-in zoom-in duration-300">
                           <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-brand-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm z-10 flex items-center gap-1.5">
                              <MapIcon className="w-3.5 h-3.5" /> Provider Live Tracking
                           </div>
                           <div className="absolute bottom-2 right-2 z-10">
                             <a 
                               href={`https://www.google.com/maps?q=${b.providerLocation.lat},${b.providerLocation.lng}`}
                               target="_blank"
                               rel="noreferrer"
                               className="bg-white/90 backdrop-blur text-brand-600 text-[10px] font-black px-2 py-1 rounded shadow-sm hover:bg-brand-50"
                             >
                               GPS Details ↗
                             </a>
                           </div>
                          <iframe
                            title={`Live location for ${b.serviceName}`}
                            src={`https://www.google.com/maps?q=${b.providerLocation.lat},${b.providerLocation.lng}&z=15&output=embed`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            className="group-hover:opacity-90 transition-opacity"
                          />
                        </div>
                      )}

                      {/* REVIEW SECTION */}
                      {b.status === "completed" && !b.userRating && !b.userFeedback && !b.userReport && !reviewSubmitted[b._id] && (
                        <div className="rounded-2xl border border-yellow-200 bg-gradient-to-b from-yellow-50/50 to-white p-6 space-y-5">
                          {b.paymentStatus !== 'paid' ? (
                            <div className="text-center py-4">
                              <ShieldAlert className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                              <h4 className="text-lg font-bold text-surface-900">Payment Compulsory</h4>
                              <p className="text-sm text-surface-500 mt-2">Please complete the payment to provide feedback or report issues.</p>
                              <Button 
                                variant="primary" 
                                className="mt-4 bg-surface-900"
                                onClick={() => { setSelectedBooking(b); setShowPayModal(true); }}
                              >
                                Pay Now ₹{b.price}
                              </Button>
                            </div>
                          ) : (
                            <>
                            <h4 className="text-sm font-black text-surface-900 uppercase tracking-widest flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Rate your experience
                          </h4>
                          <div className="space-y-4">
                            <select
                              value={reviewForms[b._id]?.rating || ""}
                              onChange={(e) => handleFormChange(b._id, "rating", e.target.value)}
                              className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-medium outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                            >
                              <option value="">Select rating</option>
                              <option value="5">5 ⭐ - Excellent, highly recommend</option>
                              <option value="4">4 ⭐ - Very Good</option>
                              <option value="3">3 ⭐ - Average</option>
                              <option value="2">2 ⭐ - Poor</option>
                              <option value="1">1 ⭐ - Terrible</option>
                            </select>
                            <textarea
                              rows="2"
                              placeholder="Leave a short review (optional)..."
                              value={reviewForms[b._id]?.feedback || ""}
                              onChange={(e) => handleFormChange(b._id, "feedback", e.target.value)}
                              className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-medium outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 resize-none transition-all"
                            />
                            <div className="pt-4 border-t border-surface-200">
                              <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Report an issue (Optional)</p>
                              <select
                                value={reviewForms[b._id]?.reason || ""}
                                onChange={(e) => handleFormChange(b._id, "reason", e.target.value)}
                                className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-medium mb-3 outline-none focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                              >
                                <option value="">Select issue type</option>
                                <option value="Late">Late Arrival</option>
                                <option value="Rude">Unprofessional / Rude</option>
                                <option value="Fraud">Fraud / Overcharging</option>
                                <option value="Other">Other</option>
                              </select>
                              <textarea
                                rows="2"
                                placeholder="Describe the issue..."
                                value={reviewForms[b._id]?.report || ""}
                                onChange={(e) => handleFormChange(b._id, "report", e.target.value)}
                                className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 font-medium outline-none focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none transition-all"
                              />
                            </div>
                            <Button
                              onClick={() => submitReview(b._id)}
                              disabled={reviewSubmitted[b._id]}
                              className="w-full py-3.5 rounded-xl text-base font-bold shadow-md"
                            >
                              {reviewSubmitted[b._id] ? "Submitting..." : "Submit Review"}
                            </Button>
                          </div>
                        </>
                        )}
                      </div>
                    )}

                      {/* REVIEW SUBMITTED */}
                      {(b.status === "completed" && (b.userRating || b.userFeedback || b.userReport || reviewSubmitted[b._id])) && (
                        <div className="rounded-2xl border-2 border-brand-100 bg-brand-50/50 p-5">
                          <h4 className="text-sm font-black text-brand-800 flex items-center gap-2 uppercase tracking-wide">
                            <CheckCircle2 className="w-5 h-5 text-brand-500" /> Feedback Complete
                          </h4>
                          <div className="mt-4 space-y-2">
                             {b.userRating && (
                               <p className="text-sm text-brand-900 font-medium bg-white p-2.5 rounded-lg border border-brand-100 flex justify-between">
                                 <span className="text-surface-500">Rating</span>
                                 <span className="font-black">{b.userRating} / 5 ⭐</span>
                               </p>
                             )}
                             {b.userFeedback && (
                               <p className="text-sm text-surface-700 font-medium bg-white p-3 rounded-lg border border-surface-100">
                                 "{b.userFeedback}"
                               </p>
                             )}
                          </div>
                          {b.userReport && (
                            <div className="mt-4 p-4 bg-red-50 border-2 border-red-100 rounded-xl">
                              <p className="text-xs font-black text-red-700 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><ShieldAlert className="w-4 h-4"/> Issue Reported</p>
                              <p className="text-sm text-red-600 font-medium bg-white p-3 rounded-lg border border-red-50">{b.userReport}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>

                  {/* FOOTER ACTIONS */}
                  <CardFooter className="p-6 bg-surface-50/50 border-t border-surface-100 flex flex-wrap gap-3">
                    {(b.status === "pending" || b.status === "accepted") &&
                    !b.otpVerified &&
                    !["declined", "cancelled", "completed"].includes(b.status) && (
                      <Button
                        variant="secondary"
                        onClick={() => cancelBooking(b._id)}
                        className="py-2.5 px-5 text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 bg-white border border-surface-200"
                      >
                        <XCircle className="w-4 h-4 mr-1.5 inline -mt-0.5"/> Cancel
                      </Button>
                    )}

                    {b.status === "accepted" && !b.providerLocation && (
                      <div className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5" /> Waiting for Technician location...
                      </div>
                    )}

                    {b.status === "accepted" && (
                      <div className="relative inline-block">
                        <Button
                          variant="primary"
                          onClick={() => navigate(`/chat/${b._id}`, {
                            state: {
                              bookingId: b._id,
                              userId: b.userId,
                              providerId: b.providerId,
                            },
                          })}
                          className="py-2.5 px-5 text-sm font-bold shadow-md shadow-brand-500/20"
                        >
                          <MessageSquare className="w-4 h-4 mr-1.5 inline -mt-0.5"/> Message
                        </Button>
                        {unreadCounts[b._id] > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-md border-2 border-white animate-pulse">
                            {unreadCounts[b._id] > 9 ? '9+' : unreadCounts[b._id]}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {b.status === 'completed' && b.paymentStatus !== 'paid' && (
                      <Button
                        variant="primary"
                        onClick={() => { setSelectedBooking(b); setShowPayModal(true); }}
                        className="bg-surface-900 hover:bg-black text-white shadow-lg py-2.5 px-6 text-sm border-none font-black ml-auto"
                      >
                        Pay ₹{b.price}
                      </Button>
                    )}
                    
                    {(["accepted", "otp verified"].includes(b.status)) && (
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 ml-auto py-2 px-4 text-sm font-bold rounded-xl"
                        onClick={() => setReportingBooking(b)}
                      >
                        Report Pro
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* REPORT MODAL */}
      {reportingBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-950/40 backdrop-blur-md p-4 animate-fade-in">
          <Card className="w-full max-w-lg p-10 shadow-2xl animate-in zoom-in duration-300 rounded-[2.5rem] border-none">
            <div className="w-16 h-16 bg-red-50 text-red-500 flex items-center justify-center rounded-full mb-6">
               <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-surface-900 mb-3">Report Provider</h2>
            <p className="text-surface-600 font-medium text-lg mb-8 leading-relaxed">
               Please provide details regarding the issue with <span className="text-surface-900 font-black">{reportingBooking.providerName}</span>. Your report remains confidential.
            </p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-black text-surface-900 mb-2 uppercase tracking-wide">Reason</label>
                <select 
                  className="w-full rounded-2xl border-none bg-surface-100/80 px-5 py-4 outline-none focus:ring-4 focus:ring-brand-100 transition-all font-bold text-surface-900"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  <option value="Late">Late Arrival</option>
                  <option value="Rude">Rude Behavior</option>
                  <option value="Fraud">Fraud / Overcharging</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-black text-surface-900 mb-2 uppercase tracking-wide">Details</label>
                <textarea 
                  rows="4"
                  className="w-full rounded-2xl border-none bg-surface-100/80 px-5 py-4 outline-none focus:ring-4 focus:ring-brand-100 transition-all text-surface-900 resize-none font-medium placeholder:text-surface-400"
                  placeholder="Tell us exactly what happened..."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <Button 
                variant="secondary"
                className="flex-1 py-4 text-base font-bold bg-white border border-surface-200"
                onClick={() => {
                  setReportingBooking(null);
                  setReportReason("");
                  setReportDescription("");
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="danger"
                className="flex-1 py-4 text-base font-bold shadow-lg shadow-red-500/20"
                onClick={async () => {
                  if (!reportReason || !reportDescription) {
                    toast.error("All fields are required");
                    return;
                  }
                  try {
                    const token = localStorage.getItem("fixfast_token");
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reports`, {
                      method: "POST",
                      headers: {
                         "Content-Type": "application/json",
                         Authorization: `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        providerId: reportingBooking.providerId?._id || reportingBooking.providerId,
                        bookingId: reportingBooking._id,
                        reason: reportReason,
                        description: reportDescription
                      })
                    });
                    
                    if (res.ok) {
                      toast.success("Complaint submitted! We will investigate immediately.", {
                        duration: 5000,
                        icon: "🛡️"
                      });
                      setReportingBooking(null);
                      setReportReason("");
                      setReportDescription("");
                      loadBookings();
                    } else {
                      const data = await res.json().catch(() => ({}));
                      toast.error(data.message || "Failed to submit report");
                    }
                  } catch (err) {
                    toast.error("Internal server error");
                  }
                }}
              >
                Submit Report
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {showPayModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-950/40 backdrop-blur-md p-4 animate-fade-in">
          <Card className="w-full max-w-md p-10 text-center shadow-2xl animate-in zoom-in duration-300 border-none rounded-[2.5rem]">
            <div className="w-20 h-20 bg-brand-50 mx-auto rounded-full flex items-center justify-center mb-6 border-4 border-brand-100">
               <IndianRupee className="w-10 h-10 text-brand-600" />
            </div>
            
            <h2 className="text-3xl font-black text-surface-900">Secure Payment</h2>
            <p className="mt-3 text-surface-500 font-bold text-lg">Scan QR or confirm below to complete payment.</p>
            
            <div className="my-8 flex justify-center relative">
              {/* Fake QR Effect */}
              <div className="absolute inset-0 bg-brand-100 blur-2xl opacity-50 rounded-full" />
              <div className="relative h-56 w-56 rounded-3xl border border-surface-200 bg-white p-5 flex items-center justify-center overflow-hidden shadow-xl">
                <div className="grid grid-cols-5 gap-2 opacity-15">
                  {[...Array(25)].map((_, i) => <div key={i} className={`h-6 w-6 rounded-sm ${Math.random()>0.3?'bg-brand-900':'bg-transparent'}`} />)}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px]">
                   <span className="text-5xl border-4 border-brand-500 rounded-2xl p-2 bg-white text-brand-600">📱</span>
                   <span className="text-[12px] font-black text-brand-800 mt-3 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full">FixFast Pay</span>
                </div>
              </div>
            </div>
            
            <div className="mb-8 rounded-2xl bg-brand-50 p-6 border-2 border-brand-100">
              <div className="text-xs font-black text-brand-600 uppercase tracking-widest mb-1">Total Amount</div>
              <div className="text-5xl font-black text-brand-600 tracking-tighter">₹{selectedBooking?.price}</div>
            </div>

            <Button
              className="w-full py-5 text-xl bg-surface-900 hover:bg-black text-white border-none shadow-xl shadow-surface-900/20 font-black rounded-[1.25rem]"
              onClick={handlePayment}
            >
              Confirm Mock Payment
            </Button>
            <button 
              onClick={() => setShowPayModal(false)}
              className="mt-6 text-base font-bold text-surface-400 hover:text-surface-600 transition"
            >
              Cancel Payment
            </button>
          </Card>
        </div>
      )}
    </>
  );
}