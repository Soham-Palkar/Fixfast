import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../ui/Navbar.jsx";
import Footer from "../ui/Footer.jsx";

export default function SiteLayout() {
  return (
    <div style={{ minHeight: "100vh", background: "#f7faf9" }}>
      <Navbar mode="customer" />
      <Outlet />
      <Footer />
    </div>
  );
}
