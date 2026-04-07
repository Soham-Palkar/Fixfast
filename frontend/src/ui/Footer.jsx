import React from "react";

export default function Footer() {
  return (
    <div style={{ background: "white", borderTop: "1px solid #e5e7eb", marginTop: 40 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "18px 16px", color: "#6b7280", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>© 2026 FixFast. All rights reserved.</div>
        <div style={{ display: "flex", gap: 14 }}>
          <span>About</span>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </div>
    </div>
  );
}
