import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import TechBanOverlay from "../../components/TechBanOverlay";

const KEY = "fixfast_history";

// CSS styles
const styles = `
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
    margin-top: 20px;
  }

  @media (min-width: 768px) {
    .dashboard-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
  }

  @media (min-width: 1024px) {
    .dashboard-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .section-card {
    background: white;
    border-radius: 16px;
    padding: 18px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    height: fit-content;
  }

  .section-card-content {
    transition: all 0.3s ease;
  }

  .section-card-content.scrollable {
    max-height: 350px;
    overflow-y: auto;
    padding-right: 6px;
  }

  .show-more-btn {
    margin-top: 10px;
    background: transparent;
    border: none;
    color: #4CAF50;
    font-weight: 500;
    cursor: pointer;
    font-size: 14px;
  }

  .show-more-btn:hover {
    text-decoration: underline;
  }

  .dashboard-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }

  .stat-card {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 120px;
  }

  .stat-number {
    font-size: 36px;
    font-weight: 700;
  }

  @media (min-width: 1200px) {
    .dashboard-stats {
      grid-template-columns: repeat(6, 1fr);
    }
  }
`;

function getDateOnly(dateValue) {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

export default function TechnicianDashboard() {
  const currentProvider = JSON.parse(
    localStorage.getItem("fixfast_current_provider") || "null"
  );

  const [status, setStatus] = useState(
    currentProvider
      ? localStorage.getItem(`fixfast_provider_status_${currentProvider._id}`) || "available"
      : "available"
  );
  const [provider, setProvider] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedService, setSelectedService] = useState("all");
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [showAllFeedback, setShowAllFeedback] = useState(false);
  const [showAllReports, setShowAllReports] = useState(false);
  const [banInfo, setBanInfo] = useState(JSON.parse(localStorage.getItem("fixfast_ban_info") || "null"));
  const [wallet, setWallet] = useState({ pendingAmount: 0, paidAmount: 0, totalEarned: 0 });

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

  const updateStatus = async (newStatus) => {
    try {
      const hasActiveJob = history.some(
        (b) =>
          b.status === "accepted" ||
          b.status === "otp verified" ||
          b.status === "in progress"
      );

      if (hasActiveJob && newStatus !== "busy") {
        toast.error("You have an active job. Status must remain 'busy'.");
        return;
      }

      const token = localStorage.getItem("fixfast_token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/availability`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ availability: newStatus }),
        }
      );

      if (!response.ok) {
        if (await checkBanResponse(response)) return;
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update availability");
      }

      const data = await response.json();
      console.log("Availability updated:", data); // Debug log
      setStatus(newStatus);
      
      localStorage.setItem(
        `fixfast_provider_status_${currentProvider._id}`,
        newStatus
      );
      
      // ✅ Refresh provider data to get updated rating
      const fetchProvider = async () => {
        try {
          const token = localStorage.getItem("fixfast_token");
          
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) {
            await checkBanResponse(res);
            return;
          }

          const data = await res.json();
          setProvider(data.user);
        } catch (error) {
          console.error("Error fetching provider:", error);
        }
      };

      fetchProvider();

    } catch (error) {
      console.error("Status update error:", error);
      alert(error.message || "Failed to update availability");
    }
  };

  useEffect(() => {
    const hasActiveJob = history.some(
      (b) =>
        b.status === "accepted" ||
        b.status === "otp verified" ||
        b.status === "in progress"
    );

    if (hasActiveJob && status !== "busy") {
      updateStatus("busy");
    }

    if (!hasActiveJob && status === "busy") {
      updateStatus("available");
    }
  }, [history]);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const token = localStorage.getItem("fixfast_token");
        
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log("Provider data from backend:", data.user); // Debug log
        setProvider(data.user);
      } catch (error) {
        console.error("Error fetching provider:", error);
      }
    };

    fetchProvider();
  }, []);

  useEffect(() => {
    loadHistory();

    const onFocus = () => loadHistory();
    const onStorage = () => loadHistory();

    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);

    const interval = setInterval(() => {
      loadHistory();
    }, 2000);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem("fixfast_token");
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/wallet`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWallet(data.wallet || { pendingAmount: 0, paidAmount: 0, totalEarned: 0 });
      }
    } catch (err) {
      console.error("Error fetching wallet:", err);
    }
  };

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem("fixfast_token");
      if (!token) {
        setHistory([]);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/provider`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        await checkBanResponse(response);
        setHistory([]);
      }
    } catch (error) {
      console.error("Error loading history:", error);
      setHistory([]);
    }
  };

  const selectedDayBookings = useMemo(() => {
    const filteredByDate = history.filter((item) => getDateOnly(item.createdAt) === selectedDate);
    
    // Filter by service if not "all"
    if (selectedService === "all") {
      return filteredByDate;
    }
    
    return filteredByDate.filter(item => item.serviceName === selectedService);
  }, [history, selectedDate, selectedService]);

  const stats = useMemo(() => {
    const totalRequests = selectedDayBookings.length;

    const accepted = selectedDayBookings.filter(
      (b) =>
        b.status === "accepted" ||
        b.status === "completed"
    ).length;

    const declined = selectedDayBookings.filter(
      (b) => b.status === "declined"
    ).length;
    const cancelled = selectedDayBookings.filter(
      (b) => b.status === "cancelled"
    ).length;

    const completed = selectedDayBookings.filter(
      (b) => b.status === "completed"
    ).length;

    // ✅ REMOVED: Frontend rating calculation - now using backend rating
    // const reviewedToday = selectedDayBookings.filter(
    //   (b) => typeof b.userRating === "number" && b.userRating > 0
    // );

    // const avgRating =
    //   reviewedToday.length > 0
    //     ? (
    //         reviewedToday.reduce((sum, item) => sum + item.userRating, 0) /
    //         reviewedToday.length
    //       ).toFixed(1)
    //     : "0.0";

    return {
      totalRequests,
      accepted,
      declined,
      cancelled,
      completed,
      // ✅ REMOVED: avgRating and totalReviews - now using backend data
    };
  }, [selectedDayBookings]);

  const feedbacks = useMemo(() => {
    return selectedDayBookings.filter(
      (item) => item.userFeedback && item.userFeedback.trim() !== ""
    );
  }, [selectedDayBookings]);

  const reports = useMemo(() => {
    return selectedDayBookings.filter(
      (item) => item.userReport && item.userReport.trim() !== ""
    );
  }, [selectedDayBookings]);

  const completedJobs = useMemo(() => {
    return selectedDayBookings.filter((item) => item.status === "completed");
  }, [selectedDayBookings]);

  // Create displayed data arrays
  const displayedJobs = showAllJobs ? completedJobs : completedJobs.slice(0, 3);
  const displayedFeedback = showAllFeedback ? feedbacks : feedbacks.slice(0, 3);
  const displayedReports = showAllReports ? reports : reports.slice(0, 3);

  // Inject styles
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    const handleBan = (e) => {
      setBanInfo(e.detail);
    };
    window.addEventListener("provider-banned", handleBan);

    return () => {
      document.head.removeChild(styleSheet);
      window.removeEventListener("provider-banned", handleBan);
    };
  }, []);

  if (banInfo) {
    return <TechBanOverlay banInfo={banInfo} />;
  }

  return (
    <div className="dashboard-container mx-auto max-w-7xl px-4 py-10 flex flex-col gap-4">
      <h1 className="text-3xl font-extrabold text-surface-900 md:text-4xl">
        Technician Dashboard
      </h1>
      <p className="mt-2 text-surface-600">
        View your daily work summary, requests, ratings, feedback, and reports.
      </p>

      {/* MODERATION STATUS BANNER */}
      {provider?.status === "flagged" && (
        <div className="rounded-2xl bg-yellow-50 border-2 border-yellow-200 p-6 flex items-center gap-6 shadow-sm">
           <span className="text-4xl animate-bounce">⚠️</span>
           <div>
             <h3 className="text-lg font-bold text-yellow-800 uppercase tracking-tighter">Account Flagged</h3>
             <p className="text-yellow-700">We noticed some issues with your recent services. Please improve to avoid further penalties.</p>
           </div>
        </div>
      )}

      {provider?.warningCount > 0 && (
        <div className="rounded-2xl bg-red-50 border-2 border-red-200 p-4 md:p-6 flex items-center gap-4 md:gap-6 shadow-sm">
           <span className="text-2xl md:text-4xl">🚫</span>
           <div>
             <h3 className="text-sm md:text-lg font-bold text-red-800 uppercase tracking-tighter">Administrative Warning ({provider.warningCount}/5)</h3>
             <p className="text-xs md:text-sm text-red-700 leading-relaxed">You have received {provider.warningCount} administrative warning(s). Reaching 5 warnings results in an automatic 30-day suspension.</p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch	">
        {/* WALLET SECTION */}
        <div className="rounded-2xl md:rounded-3xl border bg-brand-600 p-6 md:p-8 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
               <h2 className="text-xl md:text-2xl font-black italic">TECH WALLET 💳</h2>
               <span className="rounded-lg bg-white/20 px-2 py-1 font-bold text-[10px] md:text-xs uppercase">Earnings</span>
            </div>
            
            <div className="mt-6 md:mt-8 flex gap-6 md:gap-8">
              <div>
                <div className="text-[10px] md:text-xs font-bold uppercase opacity-70">Pending</div>
                <div className="text-2xl md:text-3xl font-black mt-1">₹{wallet.pendingAmount || 0}</div>
              </div>
              <div className="border-l border-white/20 pl-6 md:pl-8">
                <div className="text-[10px] md:text-xs font-bold uppercase opacity-70">Paid</div>
                <div className="text-2xl md:text-3xl font-black mt-1 text-green-300">₹{wallet.paidAmount || 0}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10 flex items-center justify-between">
             <div className="text-xs md:text-sm font-bold opacity-80">Lifetime Earnings</div>
             <div className="text-lg md:text-xl font-black">₹{wallet.totalEarned || 0}</div>
          </div>
        </div>

        {/* Status Card */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-surface-900 mb-4">Availability Status</h2>
            <div className="flex flex-wrap gap-3">
              {["available", "busy", "offline"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  className={`px-5 py-3 rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-2 ${
                    status === s
                      ? s === 'available' ? "bg-brand-600 text-white shadow-lg shadow-brand-100" :
                        s === 'busy' ? "bg-yellow-500 text-white shadow-lg shadow-yellow-100" :
                        "bg-red-500 text-white shadow-lg shadow-red-100"
                      : "border border-surface-200 bg-surface-50 text-surface-500 hover:bg-surface-100"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-4 text-sm text-surface-600 flex items-center gap-2">
            System Identity: <span className={`font-black uppercase tracking-widest ${provider?.status === 'flagged' ? 'text-red-500' : 'text-brand-600'}`}>{provider?.status || 'Active'}</span>
          </p>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-semibold text-surface-700">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-2 rounded-2xl border border-brand-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>

            {currentProvider?.services && currentProvider.services.length > 1 && (
              <div>
                <label className="block text-sm font-semibold text-surface-700">
                  Service
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="mt-2 rounded-2xl border border-brand-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-200"
                >
                  <option value="all">All Services</option>
                  {currentProvider.services.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-brand-50 border border-brand-100 px-4 py-3 text-sm text-surface-600">
            Showing records for{" "}
            <span className="font-semibold text-surface-900">{selectedDate}</span>
            {selectedService !== "all" && (
              <>
                {" • "}
                <span className="font-semibold text-surface-900">{selectedService}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <StatCard title="Requests" value={stats.totalRequests} valueClass="text-surface-900" />
        <StatCard title="Accepted" value={stats.accepted} valueClass="text-brand-700" />
        <StatCard title="Declined" value={stats.declined} valueClass="text-red-700" />
        <StatCard title="Cancelled" value={stats.cancelled} valueClass="text-red-700" />
        <StatCard title="Completed" value={stats.completed} valueClass="text-brand-700" />
        <StatCard
          title="Avg Rating"
          value={provider?.rating?.toFixed(1) || "0.0"}
          valueClass="text-brand-700"
          subtitle={`Based on ${provider?.reviews?.length || 0} review${provider?.reviews?.length === 1 ? "" : "s"
            }`}
        />
      </div>

      <div className="dashboard-grid">
        {/* Completed Jobs */}
        <div className="section-card">
          <h2 className="text-xl font-bold text-surface-900">Completed Jobs</h2>

          {completedJobs.length === 0 ? (
            <p className="mt-4 text-sm text-surface-500">
              No completed jobs for this date.
            </p>
          ) : (
            <div className={`section-card-content ${showAllJobs ? "scrollable" : ""}`}>
              <div className="mt-4 space-y-4">
                {displayedJobs.map((job) => (
                  <div key={job._id} className="rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-surface-900">{job.serviceName}</h3>
                        {job.providerName && (
                          <p className="mt-1 text-sm text-brand-700">
                            Technician: {job.providerName}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-surface-500">
                          Booked at {new Date(job.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {completedJobs.length > 3 && (
                <button
                  className="show-more-btn"
                  onClick={() => setShowAllJobs(!showAllJobs)}
                >
                  {showAllJobs ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Customer Feedback */}
        <div className="section-card">
          <h2 className="text-xl font-bold text-surface-900">Customer Feedback</h2>

          {feedbacks.length === 0 ? (
            <p className="mt-4 text-sm text-surface-500">
              No feedback submitted for this date.
            </p>
          ) : (
            <div className={`section-card-content ${showAllFeedback ? "scrollable" : ""}`}>
              <div className="mt-4 space-y-4">
                {displayedFeedback.map((item) => (
                  <div key={item._id} className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
                    <h3 className="font-bold text-surface-900">{item.serviceName}</h3>
                    <p className="mt-1 text-sm text-surface-700">
                      Rating: <span className="font-semibold">{item.userRating}/5</span>
                    </p>
                    <p className="mt-2 text-sm text-surface-700">{item.userFeedback}</p>
                    {item.reviewedAt && (
                      <p className="mt-2 text-xs text-surface-500">
                        Submitted at {new Date(item.reviewedAt).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {feedbacks.length > 3 && (
                <button
                  className="show-more-btn"
                  onClick={() => setShowAllFeedback(!showAllFeedback)}
                >
                  {showAllFeedback ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Customer Reports */}
        <div className="section-card">
          <h2 className="text-xl font-bold text-surface-900">Customer Reports</h2>

          {reports.length === 0 ? (
            <p className="mt-4 text-sm text-surface-500">
              No reports submitted for this date.
            </p>
          ) : (
            <div className={`section-card-content ${showAllReports ? "scrollable" : ""}`}>
              <div className="mt-4 space-y-4">
                {displayedReports.map((item) => (
                  <div key={item._id} className="rounded-2xl border border-red-100 bg-red-50 p-4">
                    <h3 className="font-bold text-surface-900">{item.serviceName}</h3>
                    <p className="mt-2 text-sm text-red-700">{item.userReport}</p>
                    {item.reviewedAt && (
                      <p className="mt-2 text-xs text-surface-500">
                        Submitted at {new Date(item.reviewedAt).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {reports.length > 3 && (
                <button
                  className="show-more-btn"
                  onClick={() => setShowAllReports(!showAllReports)}
                >
                  {showAllReports ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-surface-900">Date-wise Request History</h2>

        {history.length === 0 ? (
          <p className="mt-4 text-sm text-surface-500">No history available yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-sm text-surface-600">
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Service</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Rating</th>
                  <th className="px-3 py-3">Feedback</th>
                </tr>
              </thead>
              <tbody>
                {history
                  .filter((item) => getDateOnly(item.createdAt) === selectedDate)
                  .map((item) => (
                    <tr key={item._id} className="border-b text-sm text-surface-700">
                      <td className="px-3 py-3">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3">{item.serviceName}</td>
                      <td className="px-3 py-3">{item.status}</td>
                      <td className="px-3 py-3">
                        {item.userRating ? `${item.userRating}/5` : "-"}
                      </td>
                      <td className="px-3 py-3">{item.userFeedback || "-"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, valueClass = "text-surface-900" }) {
  return (
    <div className="stat-card">
      <p className="text-lg text-surface-600">{title}</p>
      <h2 className={`mt-4 stat-number ${valueClass}`}>{value}</h2>
      {subtitle && <p className="mt-2 text-sm text-surface-500">{subtitle}</p>}
    </div>
  );
}