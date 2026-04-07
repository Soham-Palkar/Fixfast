import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const USERS_KEY = "fixfast_users";
const PROVIDERS_KEY = "fixfast_service_providers";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [banInfo, setBanInfo] = useState(null);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [resending, setResending] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setBanInfo(null);
    setVerificationRequired(false);

    try {
      const endpoint =
        role === "user"
          ? "/api/auth/user/login"
          : "/api/auth/provider/login";

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // Check if NOT VERIFIED
        if (res.status === 403 && data.notVerified) {
          setVerificationRequired(true);
          return;
        }

        toast.error(data.message || "Login failed", {
        icon: "⚠️",
        style: {
          borderLeft: "5px solid #ef4444",
        },
      });
        return;
      }

      // ✅ SAVE TOKEN
      localStorage.setItem("fixfast_token", data.token);

      // Clear any previous ban info
      localStorage.removeItem("fixfast_ban_info");

      if (role === "provider") {
        localStorage.setItem(
          "fixfast_current_provider",
          JSON.stringify(data.provider)
        );
        navigate("/technician/dashboard");
      } else {
        localStorage.setItem(
          "fixfast_current_user",
          JSON.stringify(data.user)
        );
        navigate("/services");
      }

      toast.success("Login successful", {
        icon: "🎉",
        style: {
          borderLeft: "5px solid #22c55e",
        },
      });

    } catch (error) {
      console.error(error);
      toast.error("Server error", {
        icon: "❌",
        style: {
          borderLeft: "5px solid #ef4444",
        },
      });
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Verification email sent!");
      } else {
        toast.error(data.message || "Failed to resend email");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error resending email");
    } finally {
      setResending(false);
    }
  };
  
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <div className="grid gap-6 md:gap-8 md:grid-cols-2">
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-6 md:p-8 text-white shadow-xl flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Welcome to FixFast</h1>
          <p className="mt-4 text-sm md:text-base text-white/90 leading-relaxed">
            Login as a user to book home services, or login as a service provider
            to manage requests, tracking, chat, and dashboard activity.
          </p>

          <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/5">
              <h3 className="font-bold text-sm md:text-base">User Access</h3>
              <p className="mt-1 text-xs md:text-sm text-white/85">
                Book trusted technicians, track status, chat, and verify arrival.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/5">
              <h3 className="font-bold text-sm md:text-base">Service Provider Access</h3>
              <p className="mt-1 text-xs md:text-sm text-white/85">
                Accept jobs, update status, and manage your technician dashboard.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row rounded-2xl bg-gray-100 p-1 gap-1">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex-1 rounded-xl sm:rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold transition ${role === "user"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-gray-600"
                }`}
            >
              User Login
            </button>
            <button
              type="button"
              onClick={() => setRole("provider")}
              className={`flex-1 rounded-xl sm:rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold transition ${role === "provider"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-gray-600"
                }`}
            >
              Service Provider
            </button>
          </div>

          <h2 className="mt-6 text-xl md:text-2xl font-extrabold text-gray-900">
            {role === "user" ? "User Login" : "Service Provider Login"}
          </h2>
          <p className="mt-1 text-xs md:text-sm text-gray-600">
            Enter your registered email and password to continue.
          </p>
          
          {/* ... (Ban alert and Verification alert remain same code-wise but will look better in this container) ... */}
          
          {/* 🚫 BAN ALERT BANNER */}
          {banInfo && (
            <div className="mt-4 rounded-2xl border-2 border-red-300 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚫</span>
                <div>
                  <h3 className="text-base font-bold text-red-800">Account Suspended</h3>
                  <p className="mt-1 text-xs text-red-700">{banInfo.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* 📧 VERIFICATION ALERT */}
          {verificationRequired && (
            <div className="mt-4 rounded-2xl border-2 border-brand-300 bg-brand-50 p-4">
              <div className="flex items-start gap-2">
                <span className="text-2xl">📧</span>
                <div>
                  <h3 className="text-base font-bold text-brand-800">Verify Email</h3>
                  <p className="mt-1 text-xs text-brand-700 leading-relaxed">
                    Check your link at <span className="font-bold">{form.email}</span>.
                  </p>
                  <button
                    onClick={handleResend}
                    disabled={resending}
                    className="mt-2 text-xs font-bold text-brand-700 hover:text-brand-800 underline"
                  >
                    {resending ? "Sending..." : "Resend email"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full rounded-2xl border px-4 py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full rounded-2xl border px-4 py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-700 shadow-lg shadow-brand-200"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-brand-700">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}