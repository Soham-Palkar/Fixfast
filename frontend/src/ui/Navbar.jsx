import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const navItem =
  "px-3 py-2 rounded-full text-sm font-medium transition hover:bg-emerald-50 hover:text-emerald-700";
const navItemActive = "bg-emerald-100 text-emerald-800";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isTech = location.pathname.startsWith("/tech");

  return (
    <header className="sticky top-0 z-50 border-b bg-white/85 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link to={isTech ? "/tech/dashboard" : "/"} className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100">
              <span className="text-emerald-700">🔧</span>
            </div>
            <span className="text-lg font-extrabold tracking-tight">FixFast</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 md:flex">
            {!isTech ? (
              <>
                <NavLink to="/" className={({ isActive }) => `${navItem} ${isActive ? navItemActive : ""}`}>
                  Home
                </NavLink>
                <NavLink to="/services" className={({ isActive }) => `${navItem} ${isActive ? navItemActive : ""}`}>
                  Services
                </NavLink>
                <NavLink to="/bookings" className={({ isActive }) => `${navItem} ${isActive ? navItemActive : ""}`}>
                  My Bookings
                </NavLink>
                <Link
                  to="/tech/dashboard"
                  className="ml-2 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-gray-50"
                >
                  Switch to Technician
                </Link>
                <NavLink
                  to="/login"
                  className="ml-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Login
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/tech/dashboard" className={({ isActive }) => `${navItem} ${isActive ? navItemActive : ""}`}>
                  Dashboard
                </NavLink>
                <NavLink to="/tech/requests" className={({ isActive }) => `${navItem} ${isActive ? navItemActive : ""}`}>
                  Requests
                </NavLink>
                <NavLink to="/tech/marketplace" className={({ isActive }) => `${navItem} ${isActive ? navItemActive : ""}`}>
                  Marketplace
                </NavLink>
                <Link
                  to="/"
                  className="ml-2 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-gray-50"
                >
                  Switch to Customer
                </Link>
                <NavLink
                  to="/login"
                  className="ml-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Login
                </NavLink>
              </>
            )}
          </nav>

          {/* Mobile button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border transition hover:bg-gray-50 md:hidden"
            aria-label="Menu"
          >
            {open ? "✖️" : "☰"}
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden pb-4">
            <div className="grid gap-2 rounded-2xl border bg-white p-3 shadow-sm">
              {!isTech ? (
                <>
                  <Link onClick={() => setOpen(false)} to="/" className="rounded-xl px-3 py-2 hover:bg-gray-50">
                    Home
                  </Link>
                  <Link onClick={() => setOpen(false)} to="/services" className="rounded-xl px-3 py-2 hover:bg-gray-50">
                    Services
                  </Link>
                  <Link onClick={() => setOpen(false)} to="/bookings" className="rounded-xl px-3 py-2 hover:bg-gray-50">
                    My Bookings
                  </Link>
                  <Link
                    onClick={() => setOpen(false)}
                    to="/tech/dashboard"
                    className="rounded-xl px-3 py-2 hover:bg-gray-50"
                  >
                    Switch to Technician
                  </Link>
                  <Link
                    onClick={() => setOpen(false)}
                    to="/login"
                    className="rounded-xl bg-emerald-600 px-3 py-2 font-semibold text-white hover:bg-emerald-700"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <>
                  <Link onClick={() => setOpen(false)} to="/tech/dashboard" className="rounded-xl px-3 py-2 hover:bg-gray-50">
                    Dashboard
                  </Link>
                  <Link onClick={() => setOpen(false)} to="/tech/requests" className="rounded-xl px-3 py-2 hover:bg-gray-50">
                    Requests
                  </Link>
                  <Link onClick={() => setOpen(false)} to="/tech/marketplace" className="rounded-xl px-3 py-2 hover:bg-gray-50">
                    Marketplace
                  </Link>
                  <Link onClick={() => setOpen(false)} to="/" className="rounded-xl px-3 py-2 hover:bg-gray-50">
                    Switch to Customer
                  </Link>
                  <Link
                    onClick={() => setOpen(false)}
                    to="/login"
                    className="rounded-xl bg-emerald-600 px-3 py-2 font-semibold text-white hover:bg-emerald-700"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
