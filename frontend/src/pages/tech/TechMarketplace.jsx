import React from "react";

const items = [
  { title: "Digital Manifold Gauge Set", subtitle: "Professional HVAC diagnostic tool", buy: 8500, day: 350, week: 1800, stock: true },
  { title: "Pipe Wrench Set (4pc)", subtitle: "Heavy-duty pipe wrench set", buy: 2200, day: 150, week: 700, stock: true },
  { title: "Commercial Vacuum Cleaner", subtitle: "Industrial wet & dry vacuum", buy: 15000, day: 500, week: 2500, stock: false },
  { title: "Multimeter Digital Pro", subtitle: "Auto-range digital multimeter", buy: 3500, day: 200, week: 900, stock: true },
  { title: "Paint Sprayer Gun", subtitle: "Airless paint sprayer", buy: 6800, day: 400, week: 2000, stock: true },
  { title: "Cordless Drill Kit", subtitle: "18V cordless drill with accessories", buy: 4500, day: 250, week: 1200, stock: true },
];

export default function TechMarketplace() {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 34, fontWeight: 900 }}>Tools & Equipment</div>
        <div style={{ color: "#6b7280", marginTop: 6 }}>Buy or rent professional tools</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {items.map((p) => (
          <div key={p.title} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 18, padding: 18 }}>
            <div style={{ height: 110, borderRadius: 16, background: "#f3f4f6", display: "grid", placeItems: "center", color: "#9ca3af", fontWeight: 900 }}>
              IMG
            </div>

            <div style={{ marginTop: 12, fontWeight: 900 }}>{p.title}</div>
            <div style={{ marginTop: 6, color: "#6b7280", fontSize: 13 }}>{p.subtitle}</div>

            <div style={{ marginTop: 10, padding: 10, borderRadius: 14, background: "#f3f4f6", fontSize: 13 }}>
              <Row k="Buy" v={`₹${p.buy}`} />
              <Row k="Rent / day" v={`₹${p.day}`} />
              <Row k="Rent / week" v={`₹${p.week}`} />
            </div>

            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <button
                disabled={!p.stock}
                onClick={() => alert("Added to cart")}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 14,
                  border: "none",
                  background: p.stock ? "#10b981" : "#9ca3af",
                  color: "white",
                  fontWeight: 900,
                  cursor: p.stock ? "pointer" : "not-allowed",
                }}
              >
                Buy
              </button>

              <button
                disabled={!p.stock}
                onClick={() => alert("Rental requested")}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 14,
                  border: "1px solid #e5e7eb",
                  background: "white",
                  fontWeight: 900,
                  cursor: p.stock ? "pointer" : "not-allowed",
                  opacity: p.stock ? 1 : 0.6,
                }}
              >
                Rent
              </button>
            </div>

            <div style={{ marginTop: 10 }}>
              {p.stock ? (
                <span style={{ padding: "6px 10px", borderRadius: 999, background: "rgba(16,185,129,0.12)", color: "#047857", fontWeight: 900, fontSize: 12 }}>
                  In Stock
                </span>
              ) : (
                <span style={{ padding: "6px 10px", borderRadius: 999, background: "rgba(239,68,68,0.14)", color: "#991b1b", fontWeight: 900, fontSize: 12 }}>
                  Out of Stock
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
      <span style={{ color: "#6b7280" }}>{k}</span>
      <span style={{ fontWeight: 900 }}>{v}</span>
    </div>
  );
}
