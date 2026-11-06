
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const initialForm = {
  registrationNumber: "",
  vehicleType: "",
  manufacturer: "",
  model: "",
  fuelType: "",
  manufacturingYear: "",
};

const Track = () => {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("ecodriveToken");

  // Format date without timezone shifting.
  const formatDate = (date) => {
    if (!date) return "N/A";

    const [year, month, day] = String(date).slice(0, 10).split("-");

    if (!year || !month || !day) return "N/A";

    return `${day}/${month}/${year}`;
  };

  // Calculate the number of days until expiry.
  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null;

    const [year, month, day] = String(expiryDate)
      .slice(0, 10)
      .split("-")
      .map(Number);

    if (!year || !month || !day) return null;

    const expiry = Date.UTC(year, month - 1, day);

    const today = new Date();
    const todayUTC = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate()
    );

    return Math.round(
      (expiry - todayUTC) / (1000 * 60 * 60 * 24)
    );
  };

  // Determine PUC status using the 10-day grace period.
  const getPUCStatus = (expiryDate, caughtByPolice) => {
    if (caughtByPolice) return "caught";

    const daysRemaining = getDaysRemaining(expiryDate);

    if (daysRemaining === null) return "missing";
    if (daysRemaining > 10) return "valid";
    if (daysRemaining >= 0) return "warning";
    if (Math.abs(daysRemaining) <= 10) return "expired_pending";

    return "forwarded";
  };

  // Fetch vehicles and PUC certificates.
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [vehicleResponse, pucResponse] = await Promise.all([
        fetch("/api/vehicles", { headers }),
        fetch("/api/puc", { headers }),
      ]);

      const vehicleData = await vehicleResponse.json();
      const pucData = await pucResponse.json();

      if (!vehicleResponse.ok) {
        throw new Error(
          vehicleData.message || "Unable to fetch vehicles."
        );
      }

      if (!pucResponse.ok) {
        throw new Error(
          pucData.message || "Unable to fetch PUC certificates."
        );
      }

      const vehicleList = vehicleData.vehicles || [];
      const certificateList = pucData.certificates || [];

      // createdAt represents the upload time, so it determines which
      // certificate is the latest. testDate is only a tie-breaker.
      const sortedCertificates = [...certificateList].sort((a, b) => {
        const uploadDifference =
          new Date(b.createdAt || b.testDate) -
          new Date(a.createdAt || a.testDate);

        if (uploadDifference !== 0) return uploadDifference;
        return new Date(b.testDate) - new Date(a.testDate);
      });

      const vehiclesWithPUC = vehicleList.map((vehicle) => {
        const latestCertificate = sortedCertificates.find(
          (certificate) => {
            const certificateVehicleId =
              certificate.vehicle?._id || certificate.vehicle;

            return (
              String(certificateVehicleId) === String(vehicle._id)
            );
          }
        );

        return {
          ...vehicle,
          pucCertificate: latestCertificate || null,
        };
      });

      setVehicles(vehiclesWithPUC);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Please login to view your vehicles.");
      return;
    }

    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add vehicle.
  const handleAddVehicle = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          registrationNumber: form.registrationNumber
            .trim()
            .toUpperCase(),
          manufacturingYear: Number(form.manufacturingYear),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to add vehicle.");
      }

      setForm(initialForm);
      setModalOpen(false);
      setSuccess("Vehicle added successfully.");

      await fetchVehicles();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete vehicle.
  const handleDeleteVehicle = async (vehicleId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete vehicle.");
      }

      setVehicles((previous) =>
        previous.filter((vehicle) => vehicle._id !== vehicleId)
      );

      setSuccess("Vehicle deleted successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setForm(initialForm);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Page heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Track Your <span className="text-green-500">Vehicles</span>
            </h1>

            <p className="text-gray-400 mt-3">
              Monitor your vehicle information and PUC certificate status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setSuccess("");
              setModalOpen(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            Add Vehicle
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-3 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-3 rounded-xl">
            {success}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-gray-400">
            <i className="fa-solid fa-spinner fa-spin text-3xl mb-4"></i>
            <p>Loading your vehicles...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && vehicles.length === 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <i className="fa-solid fa-car text-green-500 text-5xl mb-5"></i>

            <h2 className="text-xl font-semibold">
              No Vehicles Registered
            </h2>

            <p className="text-gray-400 mt-3">
              Add your first vehicle to start tracking its PUC status.
            </p>

            <button
              onClick={() => setModalOpen(true)}
              className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition"
            >
              Add Your First Vehicle
            </button>
          </div>
        )}

        {/* Vehicle cards */}
        {!loading && vehicles.length > 0 && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
            {vehicles.map((vehicle) => {
              const certificate = vehicle.pucCertificate;

              const pucStatus = getPUCStatus(
                certificate?.expiryDate,
                vehicle.caughtByPolice
              );

              const daysRemaining = certificate
                ? getDaysRemaining(certificate.expiryDate)
                : null;

              const daysOverdue =
                daysRemaining !== null && daysRemaining < 0
                  ? Math.abs(daysRemaining)
                  : 0;

              const daysUntilForwarding = 10 - daysOverdue;

              const statusStyles = {
                valid: {
                  panel: "bg-green-500/10 border-green-500/20",
                  text: "text-green-400",
                  date: "text-green-400",
                  button: "bg-green-500 hover:bg-green-600",
                },
                warning: {
                  panel: "bg-green-500/10 border-green-500/20",
                  text: "text-green-400",
                  date: "text-green-400",
                  button: "bg-green-500 hover:bg-green-600",
                },
                expired_pending: {
                  panel: "bg-orange-500/10 border-orange-500/30",
                  text: "text-orange-400",
                  date: "text-orange-400",
                  button: "bg-orange-600 hover:bg-orange-700",
                },
                forwarded: {
                  panel: "bg-red-500/10 border-red-500/30",
                  text: "text-red-400",
                  date: "text-red-400",
                  button: "bg-red-600 hover:bg-red-700",
                },
                caught: {
                  panel: "bg-blue-500/10 border-blue-500/30",
                  text: "text-blue-400",
                  date: "text-blue-400",
                  button: "bg-blue-600 hover:bg-blue-700",
                },
                missing: {
                  panel: "bg-yellow-500/10 border-yellow-500/20",
                  text: "text-yellow-400",
                  date: "text-yellow-400",
                  button: "bg-yellow-600 hover:bg-yellow-700",
                },
              };

              const currentStatusStyle = statusStyles[pucStatus];

              return (
                <div
                  key={vehicle._id}
                  className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-green-500/60 transition"
                >
                  {/* Vehicle heading */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500/10 text-green-400 w-12 h-12 rounded-xl flex items-center justify-center text-xl">
                        <i className="fa-solid fa-car"></i>
                      </div>

                      <div>
                        <h2 className="font-bold text-lg">
                          {vehicle.manufacturer} {vehicle.model}
                        </h2>

                        <p className="text-gray-400 text-sm">
                          {vehicle.vehicleType}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteVehicle(vehicle._id)}
                      title="Delete vehicle"
                      className="text-gray-500 hover:text-red-400 transition"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>

                  {/* Registration number */}
                  <div className="mt-6 bg-gray-900 border border-gray-700 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">
                      REGISTRATION NUMBER
                    </p>

                    <h3 className="text-xl font-bold tracking-wider text-white">
                      {vehicle.registrationNumber}
                    </h3>
                  </div>

                  {/* Vehicle information */}
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div>
                      <p className="text-gray-500 text-xs">Fuel Type</p>
                      <p className="text-gray-200 mt-1">
                        {vehicle.fuelType}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs">
                        Manufacturing Year
                      </p>
                      <p className="text-gray-200 mt-1">
                        {vehicle.manufacturingYear}
                      </p>
                    </div>
                  </div>

                  {/* PUC information */}
                  <div className="mt-6 border-t border-gray-700 pt-5">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-file-circle-check text-green-400"></i>
                      <span className="font-semibold">PUC Status</span>
                    </div>

                    {/* No certificate */}
                    {!certificate && (
                      <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <p className="text-yellow-400 font-semibold">
                          Test Required
                        </p>

                        <p className="text-gray-400 text-sm mt-1">
                          No PUC certificate has been uploaded for this
                          vehicle.
                        </p>
                      </div>
                    )}

                    {/* Certificate available */}
                    {certificate && (
                      <div
                        className={`mt-3 rounded-lg p-4 border ${currentStatusStyle.panel}`}
                      >
                        {/* Status heading */}
                        <div
                          className={`flex items-center gap-2 ${currentStatusStyle.text}`}
                        >
                          <i
                            className={`fa-solid ${
                              pucStatus === "caught" || pucStatus === "valid"
                                ? "fa-circle-check"
                                : pucStatus === "warning"
                                ? "fa-clock"
                                : "fa-circle-exclamation"
                            }`}
                          ></i>

                          <p className="font-semibold">
                            {pucStatus === "caught"
                              ? "Caught by Police"
                              : pucStatus === "forwarded"
                              ? "Forwarded to Police"
                              : pucStatus === "expired_pending"
                              ? `Expired — Update Pending (${daysUntilForwarding} ${daysUntilForwarding === 1 ? "day" : "days"} until forwarding)`
                              : pucStatus === "warning"
                              ? `Expiring Soon — ${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} remaining`
                              : "PUC Valid"}
                          </p>
                        </div>

                        {pucStatus === "caught" && (
                          <p className="text-blue-300 text-sm mt-2">
                            Police has marked this vehicle as caught. Upload a new PUC certificate to start a new compliance cycle.
                          </p>
                        )}

                        {/* Certificate details */}
                        <div className="mt-4 space-y-3 text-sm">
                          <div className="flex justify-between gap-3">
                            <span className="text-gray-400">
                              Certificate No.
                            </span>

                            <span className="text-white text-right break-all">
                              {certificate.certificateNumber}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-400">Test Date</span>

                            <span className="text-white">
                              {formatDate(certificate.testDate)}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-400">Expiry Date</span>

                            <span className={`${currentStatusStyle.date} font-medium`}>

                              {formatDate(certificate.expiryDate)}
                            </span>
                          </div>

                          {/* Emission readings */}
                          <div className="border-t border-gray-700 pt-3">
                            <p className="text-gray-400 mb-2">
                              Emission Test Results
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gray-900 rounded-lg p-3">
                                <p className="text-gray-500 text-xs">
                                  CO Level
                                </p>

                                <p className="text-white font-semibold mt-1">
                                  {certificate.co}%
                                </p>
                              </div>

                              <div className="bg-gray-900 rounded-lg p-3">
                                <p className="text-gray-500 text-xs">
                                  HC Level
                                </p>

                                <p className="text-white font-semibold mt-1">
                                  {certificate.hc} ppm
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* View certificate */}
                          {certificate.certificateUrl && (
                            <a
                              href={certificate.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center justify-center gap-2 text-white font-semibold py-2.5 px-4 rounded-lg transition mt-3 ${currentStatusStyle.button}`}
                            >
                              <i className="fa-solid fa-file-pdf"></i>
                              View Certificate
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add Vehicle Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
              <div>
                <h2 className="text-2xl font-bold">Add New Vehicle</h2>

                <p className="text-gray-400 text-sm mt-1">
                  Enter your vehicle details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="text-gray-400 hover:text-white text-xl"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="p-6">
              <div className="grid md:grid-cols-2 gap-5">
                {/* Registration number */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Registration Number
                  </label>

                  <input
                    type="text"
                    name="registrationNumber"
                    value={form.registrationNumber}
                    onChange={handleChange}
                    placeholder="e.g. TS09AB1234"
                    required
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white uppercase focus:outline-none focus:border-green-500"
                  />
                </div>

                {/* Vehicle type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vehicle Type
                  </label>

                  <select
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="">Select type</option>
                    <option value="Two Wheeler">Two Wheeler</option>
                    <option value="Four Wheeler">Four Wheeler</option>
                    <option value="Heavy Vehicle">Heavy Vehicle</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Fuel type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fuel Type
                  </label>

                  <select
                    name="fuelType"
                    value={form.fuelType}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="">Select fuel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                    <option value="LPG">LPG</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Manufacturer */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Manufacturer
                  </label>

                  <input
                    type="text"
                    name="manufacturer"
                    value={form.manufacturer}
                    onChange={handleChange}
                    placeholder="e.g. Hyundai"
                    required
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Model
                  </label>

                  <input
                    type="text"
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    placeholder="e.g. i20"
                    required
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                {/* Manufacturing year */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Manufacturing Year
                  </label>

                  <input
                    type="number"
                    name="manufacturingYear"
                    value={form.manufacturingYear}
                    onChange={handleChange}
                    placeholder="e.g. 2023"
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              {error && (
                <p className="mt-5 text-sm text-red-400">{error}</p>
              )}

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition disabled:opacity-60"
                >
                  {saving ? "Adding..." : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Track;
