
import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    vehicleType: {
      type: String,
      required: true,
      enum: ["Two Wheeler", "Four Wheeler", "Heavy Vehicle", "Other"],
    },

    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    fuelType: {
      type: String,
      required: true,
      enum: ["Petrol", "Diesel", "CNG", "Electric", "LPG", "Hybrid", "Other"],
    },

    manufacturingYear: {
      type: Number,
      required: true,
    },

    caughtByPolice: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// A duplicate exists only when owner, registration number,
// and vehicle type all match.
vehicleSchema.index(
  {
    owner: 1,
    registrationNumber: 1,
    vehicleType: 1,
  },
  { unique: true }
);

vehicleSchema.index({ owner: 1 });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
