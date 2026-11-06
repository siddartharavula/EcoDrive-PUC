
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPG, PNG and PDF files are allowed.")
      );
    }

    cb(null, true);
  },
}).single("certificate");

const uploadCertificate = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a PUC certificate.",
      });
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ecodrive/puc-certificates",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);

          return res.status(500).json({
            success: false,
            message: "Failed to upload certificate to Cloudinary.",
          });
        }

        req.file.path = result.secure_url;

        next();
      }
    );

    stream.on("error", (error) => {
      console.error("Cloudinary Stream Error:", error);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Certificate upload failed.",
        });
      }
    });

    stream.end(req.file.buffer);
  });
};

export default uploadCertificate;
