import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../api/axios";

const ROLES = [
  { label: "Customer", value: "customer" },
  { label: "Technician", value: "technician" },
  { label: "Admin", value: "admin" },
  { label: "Dispatcher", value: "dispatcher" },
];

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErrMsg("");

    if (!name.trim()) return setErrMsg("Name is required");
    if (!/^\d{10}$/.test(phone)) return setErrMsg("Phone must be 10 digits");
    if (password.length < 6) return setErrMsg("Password must be at least 6 characters");

    setLoading(true);
    try {
      await register({ name, phone, password, role }); // ✅ role is lowercase
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
        <div className="hidden lg:flex flex-col justify-between p-12 border-r border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-sm text-white/80">
              <span className="h-2 w-2 rounded-full bg-brand-400" />
              Create account
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">
              Get started in <span className="text-brand-300">minutes</span>.
            </h1>
            <p className="mt-3 text-white/70 max-w-md">
              Register to book services, chat with technicians, and track jobs.
            </p>
          </div>
          <p className="text-white/40 text-sm">Use real phone number format (10 digits).</p>
        </div>

        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:p-8 shadow-xl">
              <h2 className="text-2xl font-semibold">Create account</h2>
              <p className="text-white/60 mt-1">Register to book services in minutes.</p>

              {errMsg ? (
                <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-100">
                  {errMsg}
                </div>
              ) : null}

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm text-white/70">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="mt-2 w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70">Phone</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit phone"
                    className="mt-2 w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="mt-2 w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-2 w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  disabled={loading}
                  className="w-full rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-60 px-4 py-3 font-semibold text-slate-950"
                >
                  {loading ? "Creating..." : "Create account"}
                </button>
              </form>

              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-white/60">Already have an account?</span>
                <Link className="text-brand-300 hover:text-brand-200" to="/login">
                  Login →
                </Link>
              </div>
            </div>

            <div className="lg:hidden mt-6 text-center text-white/50 text-sm">
              FixFast • Book services fast.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
