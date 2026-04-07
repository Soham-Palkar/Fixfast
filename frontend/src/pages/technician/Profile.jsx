import { useEffect, useState } from "react";

// Backend base URL for images
const BASE_URL = "http://localhost:5000";

// ✅ FIXED: Image source helper function
const getImageSrc = (img) => {
  if (!img) return "/default-avatar.png";

  if (img.startsWith("data:image")) {
    return img; // base64 → use directly
  }

  return `http://localhost:5000${img}`; // backend path
};

export default function TechnicianProfile() {
    const [form, setForm] = useState(null);
    const [editing, setEditing] = useState(false);
    const [profilePreview, setProfilePreview] = useState(null);
    const [aadhaarPreview, setAadhaarPreview] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("fixfast_token");
                if (!token) return;

                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        console.log("PROFILE IMAGE:", data.user.profilePhoto);
                        console.log("AADHAAR IMAGE:", data.user.aadhaarCard);
                        setForm(data.user);
                    }
                }
            } catch (error) {
                console.error("Failed to load profile", error);
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

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files?.[0];

        if (!file) return;

        // Create preview
        const preview = URL.createObjectURL(file);
        
        if (name === "profilePhoto") {
            setProfilePreview(preview);
        } else if (name === "aadhaarCard") {
            setAadhaarPreview(preview);
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            const base64 = reader.result;

            setForm((prev) => ({
                ...prev,
                [name]: base64, // store base64 for preview
            }));
        };

        reader.readAsDataURL(file);
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
                setForm(data.user);
                
                localStorage.setItem(
                    "fixfast_current_provider",
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

    if (!form) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-10">
                <p className="text-gray-600">No service provider profile found.</p>
            </div>
        );
    }

    const servicesText = [
        ...(form.services || []),
        ...(form.otherService ? [form.otherService] : []),
    ].join(", ");

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <div className="rounded-3xl border bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            Service Provider Profile
                        </h1>
                        <p className="mt-2 text-gray-600">
                            View and update your registered information.
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

                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} editing={editing} />
                    <Field label="Email" name="email" value={form.email} onChange={handleChange} editing={editing} />
                    <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} editing={editing} />
                    <Field label="Gender" name="gender" value={form.gender} onChange={handleChange} editing={editing} />
                    <Field label="City" name="city" value={form.city} onChange={handleChange} editing={editing} />
                    <Field label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} editing={editing} />
                    <Field
                        label="Years of Experience"
                        name="yearsOfExperience"
                        value={form.yearsOfExperience}
                        onChange={handleChange}
                        editing={editing}
                    />
                    <Field
                        label="Service Area"
                        name="serviceArea"
                        value={form.serviceArea}
                        onChange={handleChange}
                        editing={editing}
                    />
                    <Field
                        label="Aadhaar Number"
                        name="aadhaarNumber"
                        value={form.aadhaarNumber}
                        onChange={handleChange}
                        editing={editing}
                    />
                    <Field
                        label="Services Offered"
                        name="services"
                        value={servicesText}
                        onChange={handleChange}
                        editing={false}
                    />
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Profile Photo
                        </label>

                        {editing ? (
                            <div className="space-y-3">
                                {(profilePreview || form.profilePhoto) ? (
                                    <img
                                        src={getImageSrc(profilePreview || form.profilePhoto)}
                                        alt="Profile"
                                        className="h-28 w-28 rounded-2xl border object-cover"
                                        onError={(e) => {
                                            e.target.src = "/default-avatar.png";
                                        }}
                                    />
                                ) : (
                                    <div className="rounded-2xl border bg-gray-50 px-4 py-3 text-gray-800">
                                        No image uploaded
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    name="profilePhoto"
                                    onChange={handleFileChange}
                                    className="w-full rounded-2xl border px-4 py-3 outline-none"
                                />
                            </div>
                        ) : form.profilePhoto ? (
                            <img
                                src={getImageSrc(form.profilePhoto)}
                                alt="Profile"
                                className="h-28 w-28 rounded-2xl border object-cover"
                                onError={(e) => {
                                    e.target.src = "/default-avatar.png";
                                }}
                            />
                        ) : (
                            <div className="rounded-2xl border bg-gray-50 px-4 py-3 text-gray-800">
                                No image uploaded
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Aadhaar Card
                        </label>

                        {editing ? (
                            <div className="space-y-3">
                                {(aadhaarPreview || form.aadhaarCard) ? (
                                    <img
                                        src={getImageSrc(aadhaarPreview || form.aadhaarCard)}
                                        alt="Aadhaar"
                                        className="h-32 rounded-2xl border object-contain"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="rounded-2xl border bg-gray-50 px-4 py-3 text-gray-800">
                                        No image uploaded
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    name="aadhaarCard"
                                    onChange={handleFileChange}
                                    className="w-full rounded-2xl border px-4 py-3 outline-none"
                                />
                            </div>
                        ) : form.aadhaarCard ? (
                            <img
                                src={getImageSrc(form.aadhaarCard)}
                                alt="Aadhaar"
                                className="h-32 rounded-2xl border object-contain"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        ) : (
                            <div className="rounded-2xl border bg-gray-50 px-4 py-3 text-gray-800">
                                No image uploaded
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Address
                        </label>
                        {editing ? (
                            <textarea
                                name="address"
                                rows="3"
                                value={form.address || ""}
                                onChange={handleChange}
                                className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-brand-200"
                            />
                        ) : (
                            <div className="rounded-2xl border bg-gray-50 px-4 py-3 text-gray-800">
                                {form.address || "-"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({ label, name, value, onChange, editing }) {
    return (
        <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
                {label}
            </label>
            {editing ? (
                <input
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-brand-200"
                />
            ) : (
                <div className="rounded-2xl border bg-gray-50 px-4 py-3 text-gray-800">
                    {value || "-"}
                </div>
            )}
        </div>
    );
}
