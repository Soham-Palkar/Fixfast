import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface-50 text-surface-900 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Global Premium Footer */}
      <footer className="py-12 border-t border-surface-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black">F</div>
            <span className="font-black text-xl text-surface-950">FixFast</span>
          </div>
          <p className="text-xs font-bold text-surface-400 uppercase tracking-widest text-center md:text-left">
            © 2026 FixFast Technologies. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-surface-500">
            <a href="#" className="hover:text-brand-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}