
import React, { useState } from "react";
import CertificateUpload from "./CertificateUpload";

const initialForm = {
  vehicleNumber: "",
  vehicleType: "",
  fuelType: "",
  certificateNumber: "",
  testDate: "",
  co: "",
  hc: "",
};

const PucForm = () => {
  const [file, setFile] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Safely read backend response
  const readResponse = async (response) => {
    const text = await response.text();

    if (!text) {
      throw new Error(
        `Server returned an empty response. HTTP ${response.status}`
      );
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(
        `Server returned an invalid response. HTTP ${response.status}`
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!file) {
      setError("Please upload your PUC certificate.");
      return;
    }

    if (!form.testDate) {
      setError("Please select the test date.");
      return;
    }

    const token = localStorage.getItem("ecodriveToken");

    if (!token) {
      setError("Please login again.");
      return;
    }

    const data = new FormData();

    // Match backend field names
    data.append(
      "registrationNumber",
      form.vehicleNumber.trim().toUpperCase()
    );

    data.append("certificateNumber", form.certificateNumber.trim());
    data.append("testDate", form.testDate);
    data.append("co", form.co);
    data.append("hc", form.hc);
    data.append("certificate", file);

    try {
      setLoading(true);

      const response = await fetch("/api/puc", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await readResponse(response);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || `Upload failed. HTTP ${response.status}`
        );
      }

      setSuccess(
        "PUC certificate uploaded successfully!"
      );

      setForm(initialForm);
      setFile(null);
      e.target.reset();

    } catch (err) {
      console.error("PUC Upload Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-green-500 transition";

  const labelStyle =
    "block text-gray-300 text-sm font-medium mb-2";

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-2xl p-6 md:p-10 shadow-xl">

      <form onSubmit={handleSubmit} autoComplete="off">

        {/* Vehicle Information */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-6">
            Vehicle Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className={labelStyle}>
                Vehicle Number
              </label>

              <input
                required
                name="vehicleNumber"
                value={form.vehicleNumber}
                onChange={handleChange}
                placeholder="TG 26 AB 1234"
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>
                Vehicle Type
              </label>

              <select
                required
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
                className={inputStyle}
              >
                <option value="">Select vehicle</option>
                <option>Bike</option>
                <option>Car</option>
                <option>Auto</option>
                <option>Bus</option>
                <option>Truck</option>
              </select>
            </div>

            <div>
              <label className={labelStyle}>
                Fuel Type
              </label>

              <select
                required
                name="fuelType"
                value={form.fuelType}
                onChange={handleChange}
                className={inputStyle}
              >
                <option value="">Select fuel</option>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>CNG</option>
                <option>LPG</option>
              </select>
            </div>

          </div>
        </section>

        <hr className="border-gray-700 my-8" />

        {/* PUC Test Information */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-6">
            PUC Test Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className={labelStyle}>
                Certificate Number
              </label>

              <input
                required
                name="certificateNumber"
                value={form.certificateNumber}
                onChange={handleChange}
                placeholder="Certificate number"
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>
                Test Date
              </label>

              <input
                required
                type="date"
                name="testDate"
                value={form.testDate}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

          </div>

          <p className="text-green-400 text-sm mt-4">
            <i className="fa-solid fa-circle-info mr-2"></i>
            Expiry date is automatically calculated as six months from the test date.
          </p>
        </section>

        <hr className="border-gray-700 my-8" />

        {/* Emission Test Results */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">
            Emission Test Results
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            Enter the readings provided on your PUC certificate.
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className={labelStyle}>
                CO Level (%)
              </label>

              <input
                required
                type="number"
                min="0"
                step="any"
                name="co"
                value={form.co}
                onChange={handleChange}
                placeholder="Enter CO level"
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>
                HC Level (ppm)
              </label>

              <input
                required
                type="number"
                min="0"
                step="any"
                name="hc"
                value={form.hc}
                onChange={handleChange}
                placeholder="Enter HC level"
                className={inputStyle}
              />
            </div>

          </div>
        </section>

        <hr className="border-gray-700 my-8" />

        {/* Certificate Upload */}
        <CertificateUpload
          file={file}
          setFile={setFile}
        />

        {error && (
          <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg p-3 text-sm">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-3.5 rounded-lg transition"
        >
          {loading ? "Uploading..." : "Submit PUC Details"}
        </button>

      </form>
    </div>
  );
};

export default PucForm;
