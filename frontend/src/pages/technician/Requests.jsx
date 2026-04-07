import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TechBanOverlay from "../../components/TechBanOverlay";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { Card, CardContent, CardFooter } from "../../components/ui/Card.jsx";
import { 
  Calendar, 
  MapPin, 
  Phone, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  ChevronRight, 
  Clock, 
  Navigation, 
  Eye,
  AlertTriangle
} from "lucide-react";

export default function TechnicianRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [banInfo, setBanInfo] = useState(JSON.parse(localStorage.getItem("fixfast_ban_info") || "null"));
  const watchersRef = useRef({});

  const checkBanResponse = async (response) => {
    if (response.status === 403) {
      const data = await response.json().catch(() => ({}));
      if (data.banned) {
        const info = {
          reason: data.message,
          until: data.banUntil
        };
        localStorage.setItem("fixfast_ban_info", JSON.stringify(info));
        setBanInfo(info);
        return true;
      }
    }
    return false;
  };

  const handleOtpChange = (id, value) => {
    setOtpInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const verifyOtp = async (req) => {
    const enteredOtp = otpInputs[req._id];

    if (!enteredOtp) {
      toast.error("Enter OTP first", {
        icon: "⌨️",
        style: {
          borderLeft: "5px solid #f59e0b",
        },
      });
      return;
    }

    try {
      const token = localStorage.getItem('fixfast_token');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: req._id,
          otp: enteredOtp
        })
      });

      if (!response.ok) {
        if (await checkBanResponse(response)) return;
        throw new Error('Failed to verify OTP');
      }

      const watchId = watchersRef.current[req._id];
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        delete watchersRef.current[req._id];
      }

      await loadRequests();
      toast.success("OTP verified", {
        icon: "✅",
        style: {
          borderLeft: "5px solid #22c55e",
        },
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Wrong OTP or verification failed', {
        icon: "❌",
        style: {
          borderLeft: "5px solid #ef4444",
        },
      });
    }
  };

  useEffect(() => {
    loadRequests();
    markAllRequestsAsSeen(); // Mark all as seen when page opens

    const onFocus = () => {
      loadRequests();
      markAllRequestsAsSeen();
    };
    const onStorage = () => {
      loadRequests();
      markAllRequestsAsSeen();
    };

    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);

    const interval = setInterval(() => {
      loadRequests();
    }, 5000);

    const handleBan = (e) => {
      setBanInfo(e.detail);
    };
    window.addEventListener("provider-banned", handleBan);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("provider-banned", handleBan);
      clearInterval(interval);

      Object.values(watchersRef.current).forEach((watchId) => {
        if (watchId) navigator.geolocation.clearWatch(watchId);
      });
    };
  }, []);

  useEffect(() => {
    if (requests.length > 0) {
      loadUnreadCounts();
    }
  }, [requests]);

  const activeRequests = Array.isArray(requests)
    ? requests.filter(
        (req) =>
          req.status === "pending" ||
          req.status === "accepted" ||
          req.status === "otp verified"
      )
    : [];

  const sortedActive = activeRequests.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const historyRequests = Array.isArray(requests)
    ? requests.filter(
        (req) =>
          req.status === "completed" ||
          req.status === "cancelled" ||
          req.status === "declined"
      )
    : [];

  const loadUnreadCounts = async () => {
    try {
      const token = localStorage.getItem('fixfast_token');
      if (!token) return;

      const counts = {};
      
      for (const request of requests) {
        if (["accepted", "otp verified", "completed"].includes(request.status)) {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/${request._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (!response.ok) {
            await checkBanResponse(response);
            continue;
          }
          
          const messages = await response.json();
          const unreadCount = messages.filter(msg => 
            msg.isRead === false && msg.senderType === 'user'
          ).length;
          counts[request._id] = unreadCount;
          console.log(`Request ${request._id} unread count:`, unreadCount); // Debug
        }
      }
      
      setUnreadCounts(counts);
      console.log("All unread counts:", counts); // Debug
    } catch (error) {
      console.error('Error loading unread counts:', error);
    }
  };

  const markAllRequestsAsSeen = async () => {
    try {
      const token = localStorage.getItem('fixfast_token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/mark-all-seen`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Marked all requests as seen:', data.updatedCount);
      }
    } catch (error) {
      console.error('Error marking requests as seen:', error);
    }
  };

  const loadRequests = async () => {
    const currentProvider = JSON.parse(
      localStorage.getItem("fixfast_current_provider") || "null"
    );

    if (!currentProvider) {
      setRequests([]);
      return;
    }

    try {
      const token = localStorage.getItem('fixfast_token');

      const response = await
        fetch(`${import.meta.env.VITE_API_URL}/api/bookings/provider`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

      if (response.ok) {
        const data = await response.json();
        setRequests(data); // backend already filters for provider
      } else {
        await checkBanResponse(response);
        console.error('Failed to load requests');
        setRequests([]);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      setRequests([]);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('fixfast_token');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      await loadRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status', {
        icon: "⚠️",
        style: {
          borderLeft: "5px solid #ef4444",
        },
      });
    }
  };

  const updateStatusAndLocation = async (id, newStatus, location) => {
    try {
      const token = localStorage.getItem('fixfast_token');

      // Update location first
      await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}/location`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lat: location.lat,
          lng: location.lng,
          userType: 'provider'
        })
      });

      // Then update status
      await updateStatus(id, newStatus);
    } catch (error) {
      console.error('Error updating status and location:', error);
      toast.error('Failed to update status and location', {
        icon: "📍",
        style: {
          borderLeft: "5px solid #ef4444",
        },
      });
    }
  };

  const startLiveTracking = (req) => {

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in this browser.", {
        icon: "🌍",
        style: {
          borderLeft: "5px solid #f59e0b",
        },
      });
      return;
    }

    if (watchersRef.current[req._id]) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {

        const liveLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          updatedAt: new Date().toISOString(),
        };

        updateStatusAndLocation(req._id, "accepted", liveLocation);

      },
      (error) => {
        console.error("Location error:", error);
        toast.error("Unable to get live location. Please allow location permission.", {
          icon: "📍",
          style: {
            borderLeft: "5px solid #f59e0b",
          },
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    watchersRef.current[req._id] = watchId;
  };

  const stopLiveTracking = (req, nextStatus = "Reached") => {
    const watchId = watchersRef.current[req._id];

    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      delete watchersRef.current[req._id];
    }

    updateStatus(req._id, nextStatus);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      case "otp verified":
        return "bg-purple-100 text-purple-700";
      case "completed":
        return "bg-brand-100 text-brand-700";
      case "declined":
        return "bg-red-100 text-red-700";
      case "cancelled":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const openNavigation = (req) => {
    if (!req.userLocation) {
      toast.error("Customer location not available.");
      return;
    }
    const { lat, lng } = req.userLocation;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  if (banInfo) {
    return <TechBanOverlay banInfo={banInfo} />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold text-surface-900">
        Service Requests
      </h1>
      <p className="mt-1 md:mt-2 text-sm md:text-base text-surface-600">
        Accept, track, and manage customer requests.
      </p>

      {requests.length === 0 ? (
        <div className="mt-8 rounded-3xl border bg-white p-6">
          <p className="text-surface-700">No requests loaded yet.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-surface-900">
              {showHistory ? "Request History" : "Current Requests"}
            </h2>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex-1 sm:flex-none rounded-xl md:rounded-2xl border border-brand-200 px-4 py-2 text-sm md:text-base font-semibold transition hover:bg-brand-50 text-brand-700"
              >
                {showHistory ? "Show Current" : "View History"}
              </button>
            </div>
          </div>

          {showHistory ? (
            historyRequests.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                {historyRequests.map((req) => (
                  <div
                    key={req._id}
                    className="rounded-3xl border bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-extrabold text-surface-900 break-words">
                          {req.serviceName}
                        </h3>
                        
                        <p className="mt-1 text-sm text-surface-500">
                          Request received on{" "}
                          {new Date(req.createdAt).toLocaleString()}
                        </p>

                        <p className="mt-2 text-sm text-surface-600">
                          Customer has requested this service.
                        </p>

                        {req.userId && typeof req.userId === 'object' && req.userId.fullName && (
                          <p className="mt-2 text-sm text-surface-600">
                            Customer: {req.userId.fullName}
                          </p>
                        )}

                        {req.userId && typeof req.userId === 'object' && req.userId.phone && (
                          <p className="text-sm text-surface-600">
                            Contact: {req.userId.phone}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyle(
                            req.status
                          )}`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>

                    {req.userRating && (
                      <div className="mt-5 rounded-2xl border bg-brand-50 p-4">
                        <h4 className="text-sm font-bold text-surface-900">
                          Customer Review
                        </h4>

                        <p className="mt-2 text-sm text-surface-700">
                          Rating:{" "}
                          <span className="font-semibold">{req.userRating}/5</span>
                        </p>

                        {req.userFeedback && (
                          <p className="mt-1 text-sm text-surface-700">
                            Feedback: {req.userFeedback}
                          </p>
                        )}

                        {req.userReport && (
                          <p className="mt-1 text-sm text-red-700">
                            Report: {req.userReport}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 text-center">
                <p className="text-gray-600">No history found</p>
              </div>
            )
          ) : sortedActive.length > 0 ? (
            <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedActive.map((req) => (
                <div
                  key={req._id}
                  className="rounded-2xl md:rounded-3xl border bg-white p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-surface-900 truncate">
                        {req.serviceName}
                      </h3>
                      <p className="text-xs md:text-sm text-surface-500 mt-1">
                        {new Date(req.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                    <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold whitespace-nowrap ${getStatusStyle(req.status)}`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1 text-sm text-surface-700">
                    <p><span className="font-medium">Customer:</span> {req.userId?.fullName}</p>
                    <p><span className="font-medium">Contact:</span> {req.userId?.phone}</p>
                    <p><span className="font-medium">Address:</span> {req.userId?.address}</p>
                  </div>

                  {/* INLINE CUSTOMER LOCATION (ALWAYS VISIBLE WHEN ACCEPTED) */}
                  {req.status === "accepted" && req.userLocation && (
                    <div className="mt-4 rounded-2xl overflow-hidden border-2 border-brand-200 shadow-md h-64 relative group animate-in slide-in-from-top duration-300">
                       <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-brand-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm z-10 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" /> Customer Destination
                       </div>
                       <button 
                         onClick={() => openNavigation(req)}
                         className="absolute bottom-2 right-2 bg-white px-3 py-1.5 rounded-lg shadow-lg border border-brand-100 text-xs font-black text-brand-700 hover:bg-brand-50 z-20"
                       >
                         Open Directions ↗
                       </button>
                      <iframe
                        title="Customer Location"
                        width="100%"
                        height="100%"
                        loading="lazy"
                        src={`https://www.google.com/maps?q=${req.userLocation.lat},${req.userLocation.lng}&z=15&output=embed`}
                        style={{ border: 0 }}
                      ></iframe>
                    </div>
                  )}

                  {req.status === "pending" && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => updateStatus(req._id, "accepted")}
                        className="bg-brand-600 text-white px-4 py-2 rounded-xl hover:bg-brand-700 shadow-sm shadow-brand-200 transition"
                      >
                        Accept Request
                      </button>
                      <button
                        onClick={() => updateStatus(req._id, "declined")}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
                      >
                        Decline Request
                      </button>
                    </div>
                  )}

                  {req.status === "accepted" && !req.otpVerified && (
                    <div className="mt-4 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => startLiveTracking(req)}
                          className="flex-1 bg-brand-600 text-white px-4 py-2.5 rounded-xl hover:bg-brand-700 shadow-sm shadow-brand-200 transition text-sm font-bold"
                        >
                          Start Journey
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="OTP"
                          value={otpInputs[req._id] || ""}
                          onChange={(e) => handleOtpChange(req._id, e.target.value)}
                          className="w-24 md:flex-1 border border-brand-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                        />
                        <button
                          onClick={() => verifyOtp(req)}
                          className="flex-1 bg-brand-600 text-white px-4 py-2.5 rounded-xl hover:bg-brand-700 transition text-sm font-bold"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  )}

                  {req.status === "otp verified" && (
                    <div className="mt-4">
                      <button
                        onClick={() => updateStatus(req._id, "completed")}
                        className="bg-brand-600 text-white px-4 py-2 rounded-xl hover:bg-brand-700 transition"
                      >
                        Mark as Completed
                      </button>
                    </div>
                  )}

                  {["accepted", "otp verified", "completed"].includes(req.status) && (
                    <div className="mt-4 relative inline-block">
                      <button
                        onClick={() => navigate(`/technician/chat/${req._id}`, {
                          state: {
                            bookingId: req._id,
                            userId: req.userId,
                            providerId: req.providerId,
                          },
                        })}
                        className="border border-brand-200 text-brand-700 px-4 py-2 rounded-xl hover:bg-brand-50 font-semibold transition"
                      >
                        Open Chat
                      </button>
                      
                      {unreadCounts[req._id] > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {unreadCounts[req._id] > 9 ? '9+' : unreadCounts[req._id]}
                        </span>
                      )}
                    </div>
                  )}

                  {req.userRating && (
                    <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50 p-4">
                      <h4 className="text-sm font-bold text-surface-900">
                        Customer Review
                      </h4>
                      <p className="mt-2 text-sm text-surface-700">
                        Rating:{" "}
                        <span className="font-semibold">{req.userRating}/5</span>
                      </p>
                      {req.userFeedback && (
                        <p className="mt-1 text-sm text-surface-700">
                          Feedback: {req.userFeedback}
                        </p>
                      )}
                      {req.userReport && (
                        <p className="mt-1 text-sm text-red-700">
                          Report: {req.userReport}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 text-center">
              <p className="text-surface-600">No active requests</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}