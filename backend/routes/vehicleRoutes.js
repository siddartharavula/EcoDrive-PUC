
import express from "express";

import {
  addVehicle,
  getVehicles,
  deleteVehicle,
} from "../controllers/vehicleController.js";

import protect, {
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("user", "admin"));

router.post("/", addVehicle);
router.get("/", getVehicles);
router.delete("/:id", deleteVehicle);

export default router;
