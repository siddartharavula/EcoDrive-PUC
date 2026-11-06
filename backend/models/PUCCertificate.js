
import mongoose from "mongoose";

const pucCertificateSchema = new mongoose.Schema(
  {
    // User who owns the PUC certificate.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Vehicle for which the PUC test was conducted.
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    certificateNumber: {
      type: String,
      required: [true, "Certificate number is required"],
      unique: true,
      trim: true,
    },

    testDate: {
      type: Date,
      required: [true, "Test date is required"],
    },

    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
      validate: {
        validator: function (value) {
          return !this.testDate || value > this.testDate;
        },
        message: "Expiry date must be after the test date",
      },
    },

    // Emission test readings.
    co: {
      type: Number,
      required: [true, "CO reading is required"],
      min: 0,
    },

    hc: {
      type: Number,
      required: [true, "HC reading is required"],
      min: 0,
    },

    // Uploaded certificate document URL.
    certificateUrl: {
      type: String,
      required: [true, "Certificate document is required"],
    },

    // Staff member who uploaded the report.
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Efficient queries for a user's certificates and vehicle history.
pucCertificateSchema.index({ user: 1 });
pucCertificateSchema.index({ vehicle: 1 });
pucCertificateSchema.index({ expiryDate: 1 });

const PUCCertificate = mongoose.model(
  "PUCCertificate",
  pucCertificateSchema
);

export default PUCCertificate;
