import { useEffect, useState } from "react";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("fixfast_token");

        if (!token) {
          alert("Please login again");
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
          setForm(data.user);
        } else {
          alert("Failed to load profile");
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("fixfast_token");
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setForm(data.user);

        // Update local storage user metadata
        localStorage.setItem(
          "fixfast_current_user",
          JSON.stringify(data.user)
        );

        setEditing(false);
        alert("Profile updated successfully.");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Error updating profile.");
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto p-6 text-gray-600">Loading profile...</div>;

  if (!user || !form) return <div className="max-w-3xl mx-auto p-6 text-red-600">No user found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Profile</h1>
            <p className="mt-2 text-gray-600">
              Manage your personal information
            </p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="rounded-2xl bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700 transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="rounded-2xl bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          <Field label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} editing={editing} />
          <Field label="Email" name="email" value={form.email} onChange={handleChange} editing={false} />
          <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} editing={editing} />
          <Field label="City" name="city" value={form.city} onChange={handleChange} editing={editing} />
          <Field label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} editing={editing} />
          <div className="md:col-span-2">
            <Field label="Address" name="address" value={form.address} onChange={handleChange} editing={editing} multiline />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, editing, multiline }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {editing ? (
        multiline ? (
          <textarea
            name={name}
            value={value || ""}
            onChange={onChange}
            className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-brand-200"
            rows="3"
          />
        ) : (
          <input
            name={name}
            value={value || ""}
            onChange={onChange}
            className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-brand-200"
          />
        )
      ) : (
        <div className="rounded-2xl border bg-gray-50 px-4 py-3 text-gray-800">
          {value || "-"}
        </div>
      )}
    </div>
  );
}