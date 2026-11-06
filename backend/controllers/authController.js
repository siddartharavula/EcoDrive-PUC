
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Never return the password in an API response.
const getUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  phone: user.phone,
  email: user.email,
  licenceNumber: user.licenceNumber,
  address: user.address,
  role: user.role || "user",
});

// REGISTER
export const register = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      licenceNumber,
      address,
    } = req.body;

    if (
      !name ||
      !phone ||
      !email ||
      !password ||
      !licenceNumber ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedLicence = licenceNumber.trim().toUpperCase();

    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone },
        { licenceNumber: normalizedLicence },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email, phone number, or licence number already registered.",
      });
    }

    // Role is intentionally not accepted from req.body.
    // Every new registration defaults to "user".
    const user = await User.create({
      name,
      phone,
      email: normalizedEmail,
      password,
      licenceNumber: normalizedLicence,
      address,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token: generateToken(user._id),
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed.",
    });
  }
};

// LOGIN

export const login = async (req, res) => {
  try {
    const { emailOrPhoneOrLicence, password } = req.body;

    // Validate input
    if (!emailOrPhoneOrLicence || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your login ID and password.",
      });
    }

    const identifier = emailOrPhoneOrLicence.trim();

    // Search using email, phone number, or licence number.
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { phone: identifier },
        { licenceNumber: identifier.toUpperCase() },
      ],
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    // Assign default role to older accounts if missing.
    if (!user.role) {
      user.role = "user";
      await user.save();
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Return user details including role.
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        licenceNumber: user.licenceNumber,
        address: user.address,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

