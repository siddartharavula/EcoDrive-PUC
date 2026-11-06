
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "/api/auth";

export default function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    licenceNumber: "",
    loginIdentifier: "",
    houseNumber: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleModeChange = (registerMode) => {
    setIsRegister(registerMode);
    setError("");
    setSuccess("");
  };

  // Safely read and validate backend response.
  const readResponse = async (response) => {
    const responseText = await response.text();

    if (!responseText.trim()) {
      throw new Error(
        `The server returned an empty response (HTTP ${response.status}). Check the backend server.`
      );
    }

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("Non-JSON server response:", responseText);

      throw new Error(
        `The server returned an invalid response (HTTP ${response.status}). Check your API URL and backend logs.`
      );
    }

    if (!response.ok) {
      throw new Error(
        data.message || `Request failed with status ${response.status}`
      );
    }

    if (data.success !== true) {
      throw new Error(data.message || "Authentication failed.");
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (loading) return;

    // Registration validation.
    if (isRegister) {
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
        setError("Enter a valid 10-digit Indian phone number.");
        return;
      }

      if (form.password.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
      }

      if (!/^[1-9]\d{5}$/.test(form.pinCode.trim())) {
        setError("Enter a valid 6-digit PIN code.");
        return;
      }
    }

    setLoading(true);

    try {
      let endpoint;
      let payload;

      if (isRegister) {
        endpoint = `${API_URL}/register`;

        payload = {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          licenceNumber: form.licenceNumber.trim().toUpperCase(),
          address: {
            houseNumber: form.houseNumber.trim(),
            street: form.street.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            pinCode: form.pinCode.trim(),
          },
        };
      } else {
        endpoint = `${API_URL}/login`;

        payload = {
          emailOrPhoneOrLicence: form.loginIdentifier.trim(),
          password: form.password,
        };
      }

      console.log("Sending authentication request:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Authentication HTTP status:", response.status);

      const data = await readResponse(response);

      // Verify that the backend returned authentication details.
      if (!data.token || !data.user) {
        throw new Error(
          "Authentication succeeded, but the server did not return a token or user details."
        );
      }

      // Name and role must be returned by the backend.
      if (!data.user.name || !data.user.role) {
        console.error("Incomplete user details received:", data.user);

        throw new Error(
          "User name or role is missing from the server response. Check authController.js."
        );
      }

      // Normalize role before saving.
      const authenticatedUser = {
        ...data.user,
        role: String(data.user.role).trim().toLowerCase(),
      };

      // Store authentication details.
      localStorage.setItem("ecodriveToken", data.token);
      localStorage.setItem(
        "ecodriveUser",
        JSON.stringify(authenticatedUser)
      );

      // Notify Navbar and other components about login.
      window.dispatchEvent(new Event("ecodrive-auth-change"));

      setSuccess(data.message || "Authentication successful!");

      // Navigate to Home after successful login or registration.
      navigate("/", { replace: true });

    } catch (err) {
      console.error("Authentication error:", err);

      setError(
        err.message || "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500 transition placeholder-gray-500";

  const labelStyle = "block text-sm text-gray-300 mb-2";

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-10 relative">

      {/* Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-300 hover:text-green-500 transition"
      >
        <span className="text-xl px-3 font-semibold rounded-lg text-gray-700 py-1 bg-green-500 border">
          ← Home
        </span>
      </Link>

      <div className="w-full max-w-2xl bg-gray-950 border border-gray-800 rounded-2xl p-6 sm:p-10 shadow-xl">

        {/* Logo */}
        <Link to="/" className="block text-center mb-8">
          <h1 className="text-3xl font-bold">
            Eco<span className="text-green-500">Drive</span>
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Smart PUC Certificate Management
          </p>
        </Link>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">
            {isRegister ? "Create Your Account" : "Welcome Back"}
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            {isRegister
              ? "Register to manage all your vehicles in one place."
              : "Login to manage your PUC certificates."}
          </p>
        </div>

        {/* Login / Register Toggle */}
        <div className="flex bg-gray-800 p-1 rounded-lg mb-8">
          <button
            type="button"
            onClick={() => handleModeChange(false)}
            className={`w-1/2 py-2 rounded-md transition ${
              !isRegister
                ? "bg-green-500 text-gray-950 font-semibold"
                : "text-gray-400"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => handleModeChange(true)}
            className={`w-1/2 py-2 rounded-md transition ${
              isRegister
                ? "bg-green-500 text-gray-950 font-semibold"
                : "text-gray-400"
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-5 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Registration Fields */}
          {isRegister && (
            <>
              <div>
                <label className={labelStyle}>Full Name *</label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputStyle}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelStyle}>Phone Number *</label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    maxLength={10}
                    className={inputStyle}
                    autoComplete="tel"
                    required
                  />
                </div>

                <div>
                  <label className={labelStyle}>Email Address *</label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className={inputStyle}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelStyle}>
                  Driving Licence Number *
                </label>

                <input
                  type="text"
                  name="licenceNumber"
                  value={form.licenceNumber}
                  onChange={handleChange}
                  placeholder="Enter driving licence number"
                  className={inputStyle}
                  required
                />
              </div>

              {/* Structured Address */}
              <div>
                <label className={labelStyle}>Residential Address *</label>

                <div className="space-y-3">
                  <input
                    type="text"
                    name="houseNumber"
                    value={form.houseNumber}
                    onChange={handleChange}
                    placeholder="House / Flat Number"
                    className={inputStyle}
                    required
                  />

                  <input
                    type="text"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    placeholder="Street / Locality"
                    className={inputStyle}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      className={inputStyle}
                      required
                    />

                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                      className={inputStyle}
                      required
                    />
                  </div>

                  <input
                    type="text"
                    name="pinCode"
                    value={form.pinCode}
                    onChange={handleChange}
                    placeholder="6-digit PIN code"
                    maxLength={6}
                    className={inputStyle}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Login Identifier */}
          {!isRegister && (
            <div>
              <label className={labelStyle}>
                Email / Phone / Licence Number *
              </label>

              <input
                type="text"
                name="loginIdentifier"
                value={form.loginIdentifier}
                onChange={handleChange}
                placeholder="Enter email, phone or licence number"
                className={inputStyle}
                autoComplete="username"
                required
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className={labelStyle}>Password *</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`${inputStyle} pr-20`}
                autoComplete={
                  isRegister ? "new-password" : "current-password"
                }
                minLength={8}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-green-500 hover:text-green-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          {isRegister && (
            <div>
              <label className={labelStyle}>Confirm Password *</label>

              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={inputStyle}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-950 font-semibold py-3 rounded-lg transition"
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account"
                : "Login"}
          </button>
        </form>

        {/* Switch Mode */}
        <p className="text-center text-gray-400 text-sm mt-7">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => handleModeChange(!isRegister)}
            className="text-green-500 ml-2 font-medium hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
