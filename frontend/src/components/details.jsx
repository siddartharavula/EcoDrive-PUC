
import React from "react";

const Details = ({ VehicleNumber, VehicleType, VehicleExDate }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6
      hover:border-green-500 transition duration-300 shadow-lg">

      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold text-white">
          Vehicle Details
        </h3>
        <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-sm">
          Expired
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">Vehicle Number</p>
          <p className="text-white font-semibold mt-1">
            {VehicleNumber || "Not available"}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Vehicle Type</p>
          <p className="text-white font-semibold mt-1">
            {VehicleType || "Not available"}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Expiry Date</p>
          <p className="text-red-400 font-semibold mt-1">
            {VehicleExDate || "Not available"}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="w-full mt-6 bg-gray-700 hover:bg-green-500
          text-white py-2.5 rounded-lg transition"
      >
        View Details
      </button>

    </div>
  );
};

export default Details;
