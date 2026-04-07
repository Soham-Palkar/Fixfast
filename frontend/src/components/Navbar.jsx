import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/web_logo.png";
import Button from "./ui/Button.jsx";
import { Menu, X, User, LogOut, LayoutDashboard, Calendar, Wrench, ShieldCheck, Home as HomeIcon, Search } from "lucide-react";

const linkBase = "px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-surface-100 hover:text-surface-900 text-surface-600";
const activeLink = "bg-brand-50 text-brand-700 font-semibold hover:bg-brand-100";

const mobileLinkBase = "flex items-center gap-3 px-4 py-4 rounded-2xl text-base font-bold transition-all";
const mobileActiveLink = "bg-brand-600 text-white shadow-lg shadow-brand-200";
const mobileInactiveLink = "text-surface-600 hover:bg-surface-50 active:scale-95";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [unseenRequestsCount, setUnseenRequestsCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isTechnician = location.pathname.startsWith("/technician");

  const currentUser = JSON.parse(localStorage.getItem("fixfast_current_user") || "null");
  const currentProvider = JSON.parse(localStorage.getItem("fixfast_current_provider") || "null");
  const isLoggedIn = currentUser || currentProvider;

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  // Load unseen requests count for technicians
  useEffect(() => {
    if (isTechnician && currentProvider) {
      loadUnseenRequests();
      const interval = setInterval(loadUnseenRequests, 5000);
      return () => clearInterval(interval);
    }
  }, [isTechnician, location]);

  const loadUnseenRequests = async () => {
    try {
      const token = localStorage.getItem('fixfast_token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/provider`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const bookings = await response.json();
        // Only count unseen + pending requests
        const unseenCount = bookings.filter(b => !b.isSeenByTechnician && b.status === "pending").length;
        setUnseenRequestsCount(unseenCount);
      }
    } catch (error) {
      console.error('Error loading unseen requests:', error);
    }
  };

  const handleRequestsClick = async () => {
    // Mark all requests as seen when Requests button is clicked
    try {
      const token = localStorage.getItem('fixfast_token');
      const currentProvider = JSON.parse(localStorage.getItem("fixfast_current_provider") || "null");

      if (token && currentProvider) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/mark-seen/${currentProvider._id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          setUnseenRequestsCount(0); // Update UI instantly
        }
      }
    } catch (error) {
      console.error('Error marking requests as seen:', error);
    }

    navigate('/technician/requests');
  };

  const handleLogout = () => {
    localStorage.removeItem("fixfast_current_user");
    localStorage.removeItem("fixfast_current_provider");
    localStorage.removeItem("fixfast_token");
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-md border-b border-surface-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          {/* Logo */}
          <button
            onClick={() => {
              if (currentProvider) navigate("/technician/dashboard");
              else if (currentUser) navigate("/services");
              else navigate("/");
            }}
            className="flex items-center gap-2 group focus:outline-none"
          >
            <img
              src={logo}
              alt="FixFast"
              className="h-10 w-10 object-contain drop-shadow transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-display font-black tracking-tight text-surface-900 group-hover:text-brand-600 transition-colors">
              FixFast
            </span>
          </button>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1">
            {!isTechnician ? (
              <>
                <NavLink to="/" className={({ isActive }) => `${linkBase} ${isActive ? activeLink : ""}`}>
                  Home
                </NavLink>
                <NavLink to="/services" className={({ isActive }) => `${linkBase} ${isActive ? activeLink : ""}`}>
                  Services
                </NavLink>
                {currentUser && (
                  <NavLink to="/my-bookings" className={({ isActive }) => `${linkBase} ${isActive ? activeLink : ""}`}>
                    My Bookings
                  </NavLink>
                )}
                {currentUser?.role === 'admin' && (
                  <NavLink to="/admin/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? activeLink : ""}`}>
                    🛡️ Admin Panel
                  </NavLink>
                )}
              </>
            ) : (
              <>
                <NavLink to="/technician/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? activeLink : ""}`}>
                  Dashboard
                </NavLink>
                <div className="relative">
                  <button
                    onClick={handleRequestsClick}
                    className={`${linkBase} ${location.pathname === "/technician/requests" ? activeLink : ""}`}
                  >
                    Requests
                  </button>
                  {/* Unseen requests badge */}
                  {unseenRequestsCount > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/4 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      {unseenRequestsCount > 9 ? '9+' : unseenRequestsCount}
                    </span>
                  )}
                </div>
              </>
            )}
          </nav>

          {/* Desktop Right buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(isTechnician ? "/technician/profile" : "/profile")}
              >
                👤 Profile
              </Button>
            )}

            {!isLoggedIn ? (
              <Button size="sm" onClick={() => navigate("/login")}>
                Login
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-surface-700 font-semibold"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-surface-50 text-surface-600 hover:bg-brand-50 hover:text-brand-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay / Drawer */}
      {isMenuOpen && (
         <div className="fixed inset-0 z-[55] md:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Drawer */}
            <div className="absolute top-[64px] inset-x-0 bg-white border-b border-surface-100 shadow-2xl animate-in slide-in-from-top duration-300 flex flex-col p-6 max-h-[85vh] overflow-y-auto rounded-b-[2.5rem]">
               
               {/* User Info Section */}
               {isLoggedIn && (
                 <div className="flex items-center gap-4 p-4 mb-6 rounded-3xl bg-brand-50 border border-brand-100">
                    <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-black text-xl">
                       {(currentUser?.fullName || currentProvider?.fullName)?.charAt(0)}
                    </div>
                    <div>
                       <p className="text-brand-900 font-black tracking-tight leading-tight">
                         {currentUser?.fullName || currentProvider?.fullName}
                       </p>
                       <p className="text-brand-600 text-xs font-bold uppercase tracking-widest mt-0.5">
                         {isTechnician ? "Technician" : "Customer"}
                       </p>
                    </div>
                 </div>
               )}

               {/* Links Grid */}
               <div className="grid grid-cols-1 gap-2">
                 {!isTechnician ? (
                   <>
                     <NavLink 
                        to="/" 
                        className={({ isActive }) => `${mobileLinkBase} ${isActive ? mobileActiveLink : mobileInactiveLink}`}
                      >
                        <HomeIcon size={20} /> Home
                     </NavLink>
                     <NavLink 
                        to="/services" 
                        className={({ isActive }) => `${mobileLinkBase} ${isActive ? mobileActiveLink : mobileInactiveLink}`}
                      >
                        <Search size={20} /> Services
                     </NavLink>
                     {currentUser && (
                       <NavLink 
                          to="/my-bookings" 
                          className={({ isActive }) => `${mobileLinkBase} ${isActive ? mobileActiveLink : mobileInactiveLink}`}
                        >
                          <Calendar size={20} /> My Bookings
                       </NavLink>
                     )}
                     {currentUser?.role === 'admin' && (
                        <NavLink 
                           to="/admin/dashboard" 
                           className={({ isActive }) => `${mobileLinkBase} ${isActive ? mobileActiveLink : mobileInactiveLink}`}
                         >
                           <ShieldCheck size={20} /> Admin Panel
                        </NavLink>
                     )}
                   </>
                 ) : (
                   <>
                     <NavLink 
                        to="/technician/dashboard" 
                        className={({ isActive }) => `${mobileLinkBase} ${isActive ? mobileActiveLink : mobileInactiveLink}`}
                      >
                        <LayoutDashboard size={20} /> Dashboard
                     </NavLink>
                     <button
                        onClick={handleRequestsClick}
                        className={`${mobileLinkBase} ${location.pathname === "/technician/requests" ? mobileActiveLink : mobileInactiveLink} justify-between`}
                      >
                        <span className="flex items-center gap-3"><Wrench size={20} /> Requests</span>
                        {unseenRequestsCount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {unseenRequestsCount}
                          </span>
                        )}
                     </button>
                   </>
                 )}

                 <div className="h-px bg-surface-100 my-4" />

                 {isLoggedIn ? (
                   <>
                     <button 
                        onClick={() => navigate(isTechnician ? "/technician/profile" : "/profile")}
                        className={mobileLinkBase + " " + mobileInactiveLink}
                      >
                       <User size={20} /> My Profile
                     </button>
                     <button 
                        onClick={handleLogout}
                        className={mobileLinkBase + " text-red-600 hover:bg-red-50"}
                      >
                       <LogOut size={20} /> Logout
                     </button>
                   </>
                 ) : (
                   <Button className="w-full py-4 text-lg rounded-2xl" onClick={() => navigate("/login")}>
                     Login to FixFast
                   </Button>
                 )}
               </div>
            </div>
         </div>
      )}
    </>
  );
}