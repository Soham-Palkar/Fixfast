import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../api/axios";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErrMsg("");
    setLoading(true);
    try {
      await login({ phone, password });
      nav("/dashboard");
    } catch (err) {
      setErrMsg(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 border-r border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-sm text-white/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              FixFast
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">
              Reliable home repairs, <span className="text-brand-300">fast.</span>
            </h1>
            <p className="mt-3 text-white/70 max-w-md">
              Book electricians, plumbers, AC repair with transparent pricing and verified technicians.
            </p>
          </div>
          <p className="text-white/40 text-sm">Tip: Backend should be running on http://localhost:5000</p>
        </div>

        {/* Right form */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:p-8 shadow-xl">
              <h2 className="text-2xl font-semibold">Welcome back</h2>
              <p className="text-white/60 mt-1">Login to continue using FixFast.</p>

              {errMsg ? (
                <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-100">
                  {errMsg}
                </div>
              ) : null}

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm text-white/70">Phone</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9999999999"
                    className="mt-2 w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="mt-2 w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <button
                  disabled={loading}
                  className="w-full rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-60 px-4 py-3 font-semibold text-slate-950"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-white/60">New here?</span>
                <Link className="text-brand-300 hover:text-brand-200" to="/register">
                  Create account →
                </Link>
              </div>
            </div>

            {/* Mobile header */}
            <div className="lg:hidden mt-6 text-center text-white/50 text-sm">
              FixFast • Reliable home repairs, fast.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
