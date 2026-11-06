
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Overdue = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [processing, setProcessing] = useState(false);

  const token = localStorage.getItem("ecodriveToken");

  const formatDate = (date) => {
    if (!date) return "N/A";

    const [year, month, day] = String(date)
      .slice(0, 10)
      .split("-");

    return `${day}/${month}/${year}`;
  };

  const fetchOverdueVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/puc/overdue", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch overdue vehicles.");
      }

      setVehicles(data.vehicles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Please login to continue.");
      setLoading(false);
      return;
    }

    fetchOverdueVehicles();
  }, []);

  const handleCaught = async () => {
    if (!selectedVehicle) return;

    try {
      setProcessing(true);
      setError("");

      const vehicleId = selectedVehicle.vehicle._id;

      const response = await fetch(
        `/api/puc/${vehicleId}/caught`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update vehicle status.");
      }

      setVehicles((previous) =>
        previous.filter(
          (item) => item.vehicle._id !== vehicleId
        )
      );

      setSelectedVehicle(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const filteredVehicles = vehicles
    .filter((item) =>
      item.vehicle.registrationNumber
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(a.expiryDate) - new Date(b.expiryDate)
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">
            Overdue <span className="text-green-500">Certificates</span>
          </h1>

          <p className="text-gray-400 mt-3">
            Vehicles forwarded to the police after the 10-day grace period.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <p className="text-gray-400 text-sm">
            Total Vehicles Forwarded
          </p>

          <h2 className="text-4xl font-bold text-red-400 mt-2">
            {vehicles.length}
          </h2>
        </div>

        <div className="mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by registration number..."
            className="w-full md:max-w-md bg-gray-800 border border-gray-700 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
        </div>

        {loading && (
          <div className="text-center py-16 text-gray-400">
            <i className="fa-solid fa-spinner fa-spin text-3xl mb-4"></i>
            <p>Loading overdue vehicles...</p>
          </div>
        )}

        {!loading && filteredVehicles.length === 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <i className="fa-solid fa-circle-check text-green-500 text-5xl mb-5"></i>

            <h2 className="text-xl font-semibold">
              {search ? "No Matching Vehicles" : "No Overdue Vehicles"}
            </h2>

            <p className="text-gray-400 mt-3">
              {search
                ? "Try another registration number."
                : "There are currently no vehicles forwarded to the police."}
            </p>
          </div>
        )}

        {!loading && filteredVehicles.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((item) => {
              const vehicle = item.vehicle;

              return (
                <div
                  key={vehicle._id}
                  className="bg-gray-800 border border-red-500/30 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center text-xl">
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

                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">
                      REGISTRATION NUMBER
                    </p>

                    <h3 className="text-xl font-bold tracking-wider">
                      {vehicle.registrationNumber}
                    </h3>
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-400">Expiry Date</span>
                      <span className="text-red-400 font-semibold">
                        {formatDate(item.expiryDate)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-gray-400">Certificate No.</span>
                      <span className="text-white text-right break-all">
                        {item.certificateNumber}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedVehicle(item)}
                    className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
                  >
                    <i className="fa-solid fa-check mr-2"></i>
                    Caught
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedVehicle && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold">
              Confirm Vehicle Caught
            </h2>

            <p className="text-gray-400 mt-3">
              Are you sure you want to mark{" "}
              <span className="text-white font-semibold">
                {selectedVehicle.vehicle.registrationNumber}
              </span>{" "}
              as caught by police?
            </p>

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                disabled={processing}
                onClick={() => setSelectedVehicle(null)}
                className="px-5 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={processing}
                onClick={handleCaught}
                className="px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold disabled:opacity-60"
              >
                {processing ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Overdue;
