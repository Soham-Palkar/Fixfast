import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import Bookings from "./pages/Bookings.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import VerifyEmail from "./pages/public/VerifyEmail.jsx";
import NotFound from "./pages/NotFound.jsx";

import Profile from "./pages/Profile.jsx";
import TechnicianProfile from "./pages/technician/Profile.jsx";

import TechnicianDashboard from "./pages/technician/Dashboard.jsx";
import TechnicianRequests from "./pages/technician/Requests.jsx";
import TechnicianMarketplace from "./pages/technician/Marketplace.jsx";

import Chat from "./pages/Chat.jsx";
import TechnicianChat from "./pages/technician/Chat.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminTechnicians from "./pages/admin/AdminTechnicians.jsx";
import AdminPayments from "./pages/admin/AdminPayments.jsx";
import AdminReports from "./pages/admin/AdminReports.jsx";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 2500,
          style: {
            background: "#ffffff",
            color: "#1f2937",
            borderRadius: "12px",
            padding: "14px 16px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            fontSize: "14px",
            fontWeight: "500",
          },
        }}
      />
      <Routes>
        <Route element={<MainLayout />}>

        {/* Customer */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/services" element={<Services />} />
        <Route path="/my-bookings" element={<Bookings />} />
        <Route path="/profile" element={<Profile />} />

        {/* Chat */}
        <Route path="/chat/:bookingId" element={<Chat role="user" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Technician */}
        <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
        <Route path="/technician/requests" element={<TechnicianRequests />} />
        <Route path="/technician/marketplace" element={<TechnicianMarketplace />} />
        <Route path="/technician/profile" element={<TechnicianProfile />} />

        <Route path="/technician/chat/:bookingId" element={<TechnicianChat />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/technicians" element={<AdminTechnicians />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/flagged" element={<AdminTechnicians />} /> {/* Reusing the same page for flagged */}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Route>
      </Routes>
    </>
  );
}