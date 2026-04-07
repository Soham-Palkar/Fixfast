import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <p className="text-white/60">You’re logged in ✅</p>
            </div>
            <button
              onClick={logout}
              className="rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2"
            >
              Logout
            </button>
          </div>

          <pre className="mt-6 text-xs text-white/70 overflow-auto rounded-xl bg-slate-900/60 p-4 border border-white/10">
{JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
