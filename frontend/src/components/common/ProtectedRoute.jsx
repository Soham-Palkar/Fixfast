import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const { booting, isAuthed } = useAuth();

  if (booting) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-950 text-slate-100">
        Loading...
      </div>
    );
  }

  if (!isAuthed) return <Navigate to="/login" replace />;
  return <Outlet />;
}
