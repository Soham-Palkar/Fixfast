import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function TechLayout() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="min-h-[70vh]">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500 flex items-center justify-between">
          <p>© 2026 FixFast. All rights reserved.</p>
          <div className="flex gap-4">
            <a className="hover:underline" href="#">About</a>
            <a className="hover:underline" href="#">Privacy</a>
            <a className="hover:underline" href="#">Terms</a>
            <a className="hover:underline" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}