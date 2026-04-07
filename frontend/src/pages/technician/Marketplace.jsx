import { useState, useEffect } from "react";
import TechBanOverlay from "../../components/TechBanOverlay";

export default function TechnicianMarketplace() {
  const [banInfo] = useState(JSON.parse(localStorage.getItem("fixfast_ban_info") || "null"));

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("fixfast_token");
        if (!token) return;
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 403) {
          const data = await res.json().catch(() => ({}));
          if (data.banned) {
            const info = { reason: data.message, until: data.banUntil };
            localStorage.setItem("fixfast_ban_info", JSON.stringify(info));
            window.location.reload(); // Refresh to trigger overlay
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMe();
    const interval = setInterval(fetchMe, 5000);
    return () => clearInterval(interval);
  }, []);

  if (banInfo) {
    return <TechBanOverlay banInfo={banInfo} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900">
        Tools & Equipment
      </h1>
      <p className="mt-2 text-gray-600">Buy or rent professional tools.</p>

      <div className="mt-8 rounded-3xl border bg-white p-6">
        <p className="text-gray-700">Marketplace coming soon.</p>
      </div>
    </div>
  );
}