
import Vehicle from "../models/Vehicle.js";

// Add a vehicle
export const addVehicle = async (req, res) => {
  try {
    const {
      registrationNumber,
      vehicleType,
      manufacturer,
      model,
      fuelType,
      manufacturingYear,
    } = req.body;

    if (
      !registrationNumber ||
      !vehicleType ||
      !manufacturer ||
      !model ||
      !fuelType ||
      !manufacturingYear
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all vehicle details.",
      });
    }

    const normalizedRegistration = registrationNumber
      .trim()
      .toUpperCase();

    // Check only when BOTH registration number and vehicle type match.
    const existingVehicle = await Vehicle.findOne({
      owner: req.user._id,
      registrationNumber: normalizedRegistration,
      vehicleType,
    });

    if (existingVehicle) {
      return res.status(409).json({
        success: false,
        message:
          "A vehicle with this registration number and vehicle type already exists.",
      });
    }

    const vehicle = await Vehicle.create({
      owner: req.user._id,
      registrationNumber: normalizedRegistration,
      vehicleType,
      manufacturer: manufacturer.trim(),
      model: model.trim(),
      fuelType,
      manufacturingYear: Number(manufacturingYear),
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle added successfully.",
      vehicle,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A vehicle with this registration number and vehicle type already exists.",
      });
    }

    console.error("Add vehicle error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to add vehicle.",
    });
  }
};

// Get logged-in user's vehicles
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      vehicles,
    });
  } catch (error) {
    console.error("Get vehicles error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a vehicle owned by the logged-in user
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully.",
    });
  } catch (error) {
    console.error("Delete vehicle error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
