import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// const DEFAULT_SERVICES = [
//   "Plumbing",
//   "Electrician",
//   "AC Repair",
//   "Painting",
//   "Deep Cleaning",
//   "Carpentry",
//   "Appliance Repair",
//   "Pest Control",
// ];

import { SERVICES } from "../data/services";

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [userForm, setUserForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    password: "",
    confirmPassword: "",
  });

  const [serviceOptions, setServiceOptions] = useState([]);

  useEffect(() => {
    const customServices = JSON.parse(
      localStorage.getItem("fixfast_custom_services") || "[]"
    );

    setServiceOptions(SERVICES);
    // setServiceOptions([...DEFAULT_SERVICES, ...customServices]);
    // setServiceOptions([...DEFAULT_SERVICES, ...customServices, "Other"]);
  }, []);

  const [providerForm, setProviderForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    city: "",
    pincode: "",
    aadhaarNumber: "",
    yearsOfExperience: "",
    serviceArea: "",
    password: "",
    confirmPassword: "",
    services: [],
    // otherService: "",
    profilePhoto: "",
    profilePhotoName: "",
    aadhaarCard: "",
    aadhaarCardName: "",
  });

  const handleUserChange = (e) => {
    setUserForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProviderChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files?.[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onloadend = () => {
        setProviderForm((prev) => ({
          ...prev,
          [name]: reader.result, // ✅ FIX: store base64
        }));
      };

      reader.readAsDataURL(file);
      return;
    }

    setProviderForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleService = (service) => {
    setProviderForm((prev) => {
      const exists = prev.services.includes(service);

      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
  };

  const handleUserSignup = async (e) => {
    e.preventDefault();

    if (
      !userForm.fullName ||
      !userForm.email ||
      !userForm.phone ||
      !userForm.city ||
      !userForm.pincode ||
      !userForm.address ||
      !userForm.password ||
      !userForm.confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (userForm.password !== userForm.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: userForm.fullName,
            email: userForm.email,
            phone: userForm.phone,
            city: userForm.city,
            pincode: userForm.pincode,
            address: userForm.address,
            password: userForm.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      if (data.requiresVerification) {
        setRegisteredEmail(userForm.email);
        setShowSuccessModal(true);
      } else {
        // Fallback for legacy behavior if needed
        localStorage.setItem("fixfast_token", data.token);
        localStorage.setItem("fixfast_current_user", JSON.stringify(data.user));
        alert("User registered successfully ✅");
        navigate("/services");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleProviderSignup = async (e) => {
    e.preventDefault();

    const isEmpty = (value) => !value || value.trim() === "";

    if (
      isEmpty(providerForm.fullName) ||
      isEmpty(providerForm.email) ||
      isEmpty(providerForm.phone) ||
      isEmpty(providerForm.gender) ||
      isEmpty(providerForm.address) ||
      isEmpty(providerForm.city) ||
      isEmpty(providerForm.pincode) ||
      isEmpty(providerForm.aadhaarNumber) ||
      isEmpty(providerForm.yearsOfExperience) ||
      isEmpty(providerForm.serviceArea) ||
      isEmpty(providerForm.password) ||
      isEmpty(providerForm.confirmPassword)
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!providerForm.profilePhoto) {
      alert("Upload profile photo");
      return;
    }

    if (!providerForm.aadhaarCard) {
      alert("Upload Aadhaar card");
      return;
    }

    if (!providerForm.services.length) {
      alert("Select at least one service");
      return;
    }

    if (providerForm.password !== providerForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/provider/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(providerForm),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      if (data.requiresVerification) {
        setRegisteredEmail(providerForm.email);
        setShowSuccessModal(true);
      } else {
        localStorage.setItem("fixfast_token", data.token);
        localStorage.setItem("fixfast_current_provider", JSON.stringify(data.provider));
        alert("Provider registered successfully");
        navigate("/technician/dashboard");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-12">
      {/* Verification Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-300 rounded-3xl bg-white p-8 shadow-2xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl mb-6">
              📧
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Verify Your Email</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We&apos;ve sent a verification link to <span className="font-bold text-brand-700">{registeredEmail}</span>. 
              Please check your inbox (and spam folder) to activate your account.
            </p>
            <div className="mt-8 space-y-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full rounded-2xl bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-700 shadow-lg shadow-brand-200"
              >
                Continue to Login
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full rounded-2xl border px-5 py-3 font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Back to Signup
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row rounded-2xl bg-gray-100 p-1 gap-1">
          <button
            type="button"
            onClick={() => {
              setRole("user");
              setStep(1);
            }}
            className={`flex-1 rounded-xl sm:rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold transition ${role === "user"
              ? "bg-white text-brand-700 shadow-sm"
              : "text-gray-600"
              }`}
          >
            User Account
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("provider");
              setStep(1);
            }}
            className={`flex-1 rounded-xl sm:rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold transition ${role === "provider"
              ? "bg-white text-brand-700 shadow-sm"
              : "text-gray-600"
              }`}
          >
            Service Provider
          </button>
        </div>

        {role === "user" ? (
          <>
            <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              User Registration
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Create your account to book trusted home repair services.
            </p>

            <form
              onSubmit={handleUserSignup}
              className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              <Input
                label="Full Name"
                name="fullName"
                value={userForm.fullName}
                onChange={handleUserChange}
                placeholder="Enter full name"
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={userForm.email}
                onChange={handleUserChange}
                placeholder="Enter email"
              />
              <Input
                label="Phone Number"
                name="phone"
                value={userForm.phone}
                onChange={handleUserChange}
                placeholder="Enter phone number"
              />
              <Input
                label="City"
                name="city"
                value={userForm.city}
                onChange={handleUserChange}
                placeholder="Enter city"
              />
              <Input
                label="Pincode"
                name="pincode"
                value={userForm.pincode}
                onChange={handleUserChange}
                placeholder="Enter pincode"
              />

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Address
                </label>
                <textarea
                  name="address"
                  rows="3"
                  value={userForm.address}
                  onChange={handleUserChange}
                  required
                  placeholder="Enter full address"
                  className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-brand-200"
                />
              </div>

              <Input
                label="Password"
                name="password"
                type="password"
                value={userForm.password}
                onChange={handleUserChange}
                placeholder="Enter password"
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={userForm.confirmPassword}
                onChange={handleUserChange}
                placeholder="Confirm password"
              />

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-700"
                >
                  Create User Account
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              Service Provider Registration
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Fill all details carefully for verification and safer onboarding.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest">
              <div className={`px-2 py-1 rounded-md ${step >= 1 ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-400"}`}>1. Personal</div>
              <span className="text-gray-300">/</span>
              <div className={`px-2 py-1 rounded-md ${step >= 2 ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-400"}`}>2. Address</div>
              <span className="text-gray-300">/</span>
              <div className={`px-2 py-1 rounded-md ${step >= 3 ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-400"}`}>3. Verify</div>
              <span className="text-gray-300">/</span>
              <div className={`px-2 py-1 rounded-md ${step >= 4 ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-400"}`}>4. Finish</div>
            </div>

            <form onSubmit={handleProviderSignup} className="mt-8 space-y-6 sm:space-y-8">

              {/* STEP 1 */}
              {step === 1 && (
                <Section title="Personal Information">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <Input
                      label="Full Name"
                      name="fullName"
                      value={providerForm.fullName}
                      onChange={handleProviderChange}
                      placeholder="Enter full legal name"
                    />

                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={providerForm.email}
                      onChange={handleProviderChange}
                      placeholder="Enter email"
                    />

                    <Input
                      label="Phone Number"
                      name="phone"
                      value={providerForm.phone}
                      onChange={handleProviderChange}
                      placeholder="Enter phone number"
                    />

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Gender
                      </label>

                      <select
                        name="gender"
                        value={providerForm.gender}
                        onChange={handleProviderChange}
                        required
                        className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-brand-200"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <Input
                      label="Years of Experience"
                      name="yearsOfExperience"
                      value={providerForm.yearsOfExperience}
                      onChange={handleProviderChange}
                      placeholder="Enter years of experience"
                    />

                    <FileInput
                      label="Profile Photo"
                      name="profilePhoto"
                      capture="user"
                      accept="image/*"
                      onChange={handleProviderChange}
                    />

                  </div>
                </Section>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <Section title="Address Details">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <div className="md:col-span-2">
                      <TextArea
                        label="Address"
                        name="address"
                        value={providerForm.address}
                        onChange={handleProviderChange}
                        placeholder="Enter your full address"
                      />
                    </div>

                    <Input
                      label="City"
                      name="city"
                      value={providerForm.city}
                      onChange={handleProviderChange}
                      placeholder="Enter city"
                    />

                    <Input
                      label="Pincode"
                      name="pincode"
                      value={providerForm.pincode}
                      onChange={handleProviderChange}
                      placeholder="Enter pincode"
                    />

                    <Input
                      label="Service Area"
                      name="serviceArea"
                      value={providerForm.serviceArea}
                      onChange={handleProviderChange}
                      placeholder="Enter working/service area"
                    />

                  </div>
                </Section>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <>
                  <Section title="Identity Verification">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                      <Input
                        label="Aadhaar Number"
                        name="aadhaarNumber"
                        value={providerForm.aadhaarNumber}
                        onChange={handleProviderChange}
                        placeholder="Enter Aadhaar number"
                      />

                      <FileInput
                        label="Upload Aadhaar Card"
                        name="aadhaarCard"
                        accept="image/*"
                        onChange={handleProviderChange}
                      />

                    </div>
                  </Section>

                  <Section title="Services Offered">

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                      {serviceOptions.map((service) => {

                        const selected = providerForm.services.includes(service);

                        return (
                          <button
                            key={service}
                            type="button"
                            onClick={() => toggleService(service)}
                            className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${selected
                              ? "border-brand-200 bg-brand-100 text-brand-800"
                              : "hover:bg-gray-50"
                              }`}
                          >
                            {service}
                          </button>
                        );
                      })}

                    </div>

                    {/* {providerForm.services.includes("Other") && (
                      <div className="mt-4">
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                          Enter Your Service
                        </label>

                        <input
                          type="text"
                          name="otherService"
                          value={providerForm.otherService}
                          onChange={handleProviderChange}
                          placeholder="Enter your custom service"
                          className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-brand-200"
                          required
                        />
                      </div>
                    )} */}

                  </Section>

                </>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <Section title="Password Setup">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      value={providerForm.password}
                      onChange={handleProviderChange}
                      placeholder="Enter password"
                    />

                    <Input
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={providerForm.confirmPassword}
                      onChange={handleProviderChange}
                      placeholder="Confirm password"
                    />

                  </div>
                </Section>
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="flex justify-between">

                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="rounded-2xl border px-5 py-3 font-semibold"
                  >
                    Back
                  </button>
                )}

                {step < 4 && (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="ml-auto rounded-2xl bg-brand-600 px-5 py-3 font-semibold text-white"
                  >
                    Next
                  </button>
                )}

                {step === 4 && (
                  <div className="ml-auto">
                    <button
                      type="submit"
                      className="rounded-2xl bg-brand-600 px-5 py-3 font-semibold text-white"
                    >
                      Create Service Provider Account
                    </button>
                  </div>
                )}

              </div>

            </form>
          </>
        )}

        <p className="mt-8 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-700">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-3xl border bg-gray-50 p-5">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-brand-200"
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <textarea
        name={name}
        rows="3"
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-brand-200"
      />
    </div>
  );
}

function FileInput({ label, name, onChange, accept = "image/*", capture }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type="file"
        name={name}
        accept={accept}
        capture={capture}
        onChange={onChange}
        required
        className="w-full rounded-2xl border px-4 py-3 outline-none"
      />
    </div>
  );
}