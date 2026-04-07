import React from "react";

export default function TechDashboard() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 34, fontWeight: 900 }}>Hello, Rajesh! 👋</div>
          <div style={{ color: "#6b7280", marginTop: 6 }}>Welcome back to your dashboard</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ color: "#16a34a", fontWeight: 900 }}>Online</span>
          <div style={{ width: 44, height: 26, borderRadius: 999, background: "rgba(16,185,129,0.25)", position: "relative" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#10b981", position: "absolute", top: 2, right: 2 }} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        <Stat title="Jobs Completed" value="856" />
        <Stat title="Today's Earnings" value="₹2,450" />
        <Stat title="Reviews" value="4.9" sub="342 Reviews" />
      </div>

      <div style={{ marginTop: 18, background: "white", border: "1px solid #e5e7eb", borderRadius: 18, padding: 18 }}>
        <div style={{ fontSize: 18, fontWeight: 900 }}>Active Jobs</div>
        <div style={{ marginTop: 12, background: "#f3f4f6", borderRadius: 14, padding: 14, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 900 }}>AC Repair</div>
            <div style={{ color: "#6b7280", marginTop: 4 }}>42 MG Road, Bangalore</div>
          </div>
          <div style={{ padding: "6px 10px", borderRadius: 999, background: "rgba(16,185,129,0.12)", color: "#047857", fontWeight: 900 }}>
            in progress
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value, sub }) {
  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 18, padding: 18 }}>
      <div style={{ color: "#6b7280", fontWeight: 800 }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 28, fontWeight: 900 }}>{value}</div>
      {sub ? <div style={{ marginTop: 6, color: "#6b7280" }}>{sub}</div> : null}
    </div>
  );
}
