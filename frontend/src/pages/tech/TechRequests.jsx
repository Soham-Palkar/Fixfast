import React, { useState } from "react";

export default function TechRequests() {
  const [status, setStatus] = useState("new");

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "70vh" }}>
      <div style={{ width: "min(760px, 100%)", background: "white", border: "1px solid #e5e7eb", borderRadius: 18, padding: 18 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 34, fontWeight: 900 }}>Job Requests</div>
          <div style={{ color: "#6b7280", marginTop: 6 }}>New service requests from customers</div>
        </div>

        <div style={{ marginTop: 18, border: "1px solid #e5e7eb", borderRadius: 18, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>Deep Cleaning</div>
              <div style={{ color: "#6b7280", marginTop: 6 }}>Full house deep cleaning - 3BHK</div>
              <div style={{ color: "#6b7280", marginTop: 10, fontSize: 13 }}>
                2026-02-12 • 9:00 AM • 88 Indiranagar, Bangalore
              </div>
            </div>
            <div style={{ fontWeight: 900, fontSize: 18, color: "#10b981" }}>₹2999</div>
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => setStatus("accepted")}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 14,
                border: "none",
                background: "#10b981",
                color: "white",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Accept
            </button>
            <button
              onClick={() => setStatus("declined")}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 14,
                border: "1px solid #e5e7eb",
                background: "white",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Decline
            </button>
          </div>

          {status !== "new" && (
            <div style={{ marginTop: 14, padding: 12, borderRadius: 14, background: "#f3f4f6", fontWeight: 800 }}>
              {status === "accepted" ? "✅ Job Accepted! You accepted the Deep Cleaning job." : "❌ Job Declined. The request has been declined."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
