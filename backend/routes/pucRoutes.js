
import express from "express";

import {
  addPUC,
  getPUCs,
  getOverdueVehicles,
  markVehicleCaught,
} from "../controllers/pucController.js";

import protect, {
  authorize,
} from "../middleware/authMiddleware.js";

import uploadCertificate from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Vehicle owner and admin.
router.get("/", protect, authorize("user", "admin"), getPUCs);

// Police and admin.
router.get(
  "/overdue",
  protect,
  authorize("police", "admin"),
  getOverdueVehicles
);

router.patch(
  "/:vehicleId/caught",
  protect,
  authorize("police", "admin"),
  markVehicleCaught
);

// PUC updater and admin.
router.post(
  "/",
  protect,
  authorize("puc_updater", "admin"),
  uploadCertificate,
  addPUC
);

export default router;
