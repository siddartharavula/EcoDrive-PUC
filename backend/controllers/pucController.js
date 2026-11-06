
import PUCCertificate from "../models/PUCCertificate.js";
import Vehicle from "../models/Vehicle.js";

// Calculate expiry date: 6 calendar months after test date.
const calculateExpiryDate = (testDate) => {
  const [year, month, day] = testDate.split("-").map(Number);

  const targetMonth = month - 1 + 6;
  const targetYear = year + Math.floor(targetMonth / 12);
  const finalMonth = targetMonth % 12;

  const lastDay = new Date(
    Date.UTC(targetYear, finalMonth + 1, 0)
  ).getUTCDate();

  return new Date(
    Date.UTC(targetYear, finalMonth, Math.min(day, lastDay))
  );
};

// Upload PUC certificate.
export const addPUC = async (req, res) => {
  try {
    const { registrationNumber, certificateNumber, testDate, co, hc } =
      req.body;

    if (
      !registrationNumber ||
      !certificateNumber ||
      !testDate ||
      co === undefined ||
      hc === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all certificate details.",
      });
    }

    if (!req.file?.path) {
      return res.status(400).json({
        success: false,
        message: "Certificate file is missing.",
      });
    }

    const vehicle = await Vehicle.findOne({
      registrationNumber: registrationNumber.trim().toUpperCase(),
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found. Check the registration number.",
      });
    }

    const testDateObject = new Date(`${testDate}T00:00:00.000Z`);

    if (Number.isNaN(testDateObject.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid test date.",
      });
    }

    const coValue = Number(co);
    const hcValue = Number(hc);

    if (
      !Number.isFinite(coValue) ||
      !Number.isFinite(hcValue) ||
      coValue < 0 ||
      hcValue < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "CO and HC readings must be valid non-negative numbers.",
      });
    }

    const expiryDate = calculateExpiryDate(testDate);

    const certificate = await PUCCertificate.create({
      user: vehicle.owner,
      vehicle: vehicle._id,
      certificateNumber: certificateNumber.trim(),
      testDate: testDateObject,
      expiryDate,
      co: coValue,
      hc: hcValue,
      certificateUrl: req.file.path,
      uploadedBy: req.user._id,
    });

    // A new PUC starts a new compliance cycle.
    await Vehicle.findByIdAndUpdate(vehicle._id, {
      $set: { caughtByPolice: false },
    });

    return res.status(201).json({
      success: true,
      message: "PUC certificate uploaded successfully.",
      certificate,
    });
  } catch (error) {
    console.error("PUC Upload Error:", error);

    return res.status(error.code === 11000 ? 409 : 400).json({
      success: false,
      message:
        error.code === 11000
          ? "Certificate number already exists."
          : error.message,
    });
  }
};

// Get PUC certificates belonging to the logged-in user.
export const getPUCs = async (req, res) => {
  try {
    const certificates = await PUCCertificate.find({
      user: req.user._id,
    })
      .populate("vehicle")
      .sort({ testDate: -1 });

    return res.status(200).json({
      success: true,
      certificates,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get vehicles forwarded to police after 10 complete grace days.
export const getOverdueVehicles = async (req, res) => {
  try {
    const today = new Date();

    const todayUTC = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // Expiry must be earlier than the date 10 days before today.
    // Example: expiry Nov 10 is forwarded on Nov 21.
    const cutoffDate = new Date(todayUTC - 10 * 24 * 60 * 60 * 1000);

    const latestCertificates = await PUCCertificate.aggregate([
      {
        $sort: {
          testDate: -1,
          createdAt: -1,
        },
      },
      {
        $group: {
          _id: "$vehicle",
          certificate: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$certificate",
        },
      },
      {
        $match: {
          expiryDate: { $lt: cutoffDate },
        },
      },
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicle",
          foreignField: "_id",
          as: "vehicle",
        },
      },
      {
        $unwind: "$vehicle",
      },
      {
        $match: {
          "vehicle.caughtByPolice": { $ne: true },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          expiryDate: 1,
        },
      },
      {
        $project: {
          certificateNumber: 1,
          testDate: 1,
          expiryDate: 1,
          vehicle: {
            _id: "$vehicle._id",
            registrationNumber: "$vehicle.registrationNumber",
            vehicleType: "$vehicle.vehicleType",
            manufacturer: "$vehicle.manufacturer",
            model: "$vehicle.model",
            caughtByPolice: "$vehicle.caughtByPolice",
          },
          owner: {
            _id: "$owner._id",
            name: "$owner.name",
            phone: "$owner.phone",
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: latestCertificates.length,
      vehicles: latestCertificates,
    });
  } catch (error) {
    console.error("Overdue Fetch Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Police confirms that a vehicle has been caught.
export const markVehicleCaught = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    if (vehicle.caughtByPolice) {
      return res.status(409).json({
        success: false,
        message: "This vehicle has already been marked as caught.",
      });
    }

    vehicle.caughtByPolice = true;
    await vehicle.save();

    return res.status(200).json({
      success: true,
      message: "Vehicle marked as caught successfully.",
      vehicleId: vehicle._id,
    });
  } catch (error) {
    console.error("Mark Caught Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
