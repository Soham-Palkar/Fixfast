import React from 'react';

export default function TechBanOverlay({ banInfo }) {
  if (!banInfo) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900 bg-opacity-95 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-[2.5rem] bg-white p-10 text-center shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-6 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900">Account Suspended</h1>
        <p className="mb-8 text-lg text-gray-600 leading-relaxed font-medium">
          Your technician account has been temporarily disabled due to multiple customer complaints.
        </p>

        <div className="mb-8 rounded-3xl bg-red-50 p-6 text-left border border-red-100">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <p className="text-sm font-bold text-red-900 uppercase tracking-wider">Restriction Details</p>
          </div>
          <p className="text-red-700 font-bold text-lg mb-1">{banInfo.reason || "Automatic threshold reached"}</p>
          <p className="text-red-600 font-semibold opacity-90">
            Suspension ends on: <span className="text-red-900">{new Date(banInfo.until).toLocaleString()}</span>
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="w-full rounded-2xl bg-gray-900 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            Sign Out from Account
          </button>
          <p className="text-sm text-gray-400 font-medium">If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
}
