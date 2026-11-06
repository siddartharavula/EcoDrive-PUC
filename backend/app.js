import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import pucRoutes from "./routes/pucRoutes.js";
import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EcoDrive Backend is Running!",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/puc", pucRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;