import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email/${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          toast.success("Email verified! You can now log in.");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. The link may be invalid or expired.");
          toast.error(data.message || "Verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred during verification. Please try again later.");
        toast.error("Server error during verification");
      }
    };

    if (token) {
      verify();
    }
  }, [token]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8 text-center shadow-sm">
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600"></div>
            <h2 className="text-2xl font-extrabold text-gray-900">Verifying...</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
              ✅
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Email Verified!</h2>
            <p className="text-gray-600">{message}</p>
            <Link
              to="/login"
              className="inline-block w-full rounded-2xl bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-700"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">
              ❌
            </div>
            <p className="text-surface-500 mb-8 max-w-sm mx-auto">
              The verification link might be invalid or has already expired. 
              Try logging in to request a new one.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                className="w-full rounded-2xl bg-brand-600 py-4 font-black text-white shadow-xl shadow-brand-200 transition hover:bg-brand-700 active:scale-95"
              >
                Go to Login
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              Link expired? You can request a new one at the login page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
