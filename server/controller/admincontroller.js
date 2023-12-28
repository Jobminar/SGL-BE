
import jwt from "jsonwebtoken";
import { sendMessage } from "fast-two-sms";
import Admin from "../models/admin.js";
import AdminLoginHistory from "../models/adminLoginHistory.js";
// Creating a secret key for JWT
const secret = "jobminar";
const { sign, verify } = jwt;
const { findOne, findById } = Admin;

// Creating a function to generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
//OTP generation
const sendOTP = async (phone) => {
  try {
    // Generate a random 6-digit OTP
    const otp = generateOTP();

    // Save the OTP and expiration time in the database
    const admin = await Admin.findOne({ phone });
    if (admin) {
      admin.otp = otp;
      admin.otpExpire = Date.now() + 300000; // OTP expires in 5 minutes
      await admin.save();
    }

    // Return the generated OTP for testing purposes
    return otp;
  } catch (error) {
    console.error(error);
    throw new Error("Error generating OTP");
  }
};

// admin registration controller
const registerAdmin = async (req, res) => {
  try {
    const { phone, name } = req.body;

    // Validate input
    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    // Check if the admin already exists
    const admin = await Admin.findOne({ phone });
    if (admin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Ensure that the name is "sgldiamonds"
    if (name !== "sgldiamonds") {
      return res
        .status(400)
        .json({ message: "Invalid name. Name must be 'sgldiamonds'" });
    }

    // Create a new admin and save to the database
    const newAdmin = new Admin({ phone, name });
    await newAdmin.save();

    // Create a login history record for the new admin
    const loginHistory = new AdminLoginHistory({ admin: newAdmin._id });
    await loginHistory.save();

    // Sending a success response
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// admin login controller

const loginAdmin = async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate input
    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    // Find the admin by phone number
    const admin = await Admin.findOne({ phone });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Send the OTP and get the generated OTP for testing
    const generatedOTP = await sendOTP(phone);

    // Log the generated OTP for testing purposes
    console.log("Generated OTP:", generatedOTP);

    // Send a success response with the admin's id
    res.status(200).json({ message: "OTP sent", adminId: admin.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Verify OTP controller
const verifyOTP = async (req, res) => {
  try {
    const { adminId, otp } = req.body;

    // Validate input
    if (!adminId || !otp) {
      return res.status(400).json({ message: "admin id and OTP are required" });
    }

    // Find the admin by id using the Admin model
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "admin not found" });
    }

    // Check if the OTP is valid and not expired
    if (admin.otp === otp && admin.otpExpire > Date.now()) {
      // Generate a JWT token with the admin's phone number and name as payload
      const token = sign({ phone: admin.phone, name: admin.name }, secret, {
        expiresIn: "1h",
      });

      // Clear the admin's OTP and expiration time from the database
      admin.otp = null;
      admin.otpExpire = null;
      await admin.save();

      // Send a success response with the token
      res.status(200).json({ message: "OTP verified", token: token });
    } else {
      // Send an error response if the OTP is invalid or expired
      res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// admin profile controller
const getadminProfile = (req, res) => {
  try {
    const { phone, name } = req.admin;

    // Send a success response with the admin's profile
    res.status(200).json({ phone, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Middleware function for verifying the JWT token
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = verify(token, secret);
      req.admin = { phone: decoded.phone, name: decoded.name };
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default {
  registerAdmin,
  loginAdmin,
  verifyOTP,
  getadminProfile,
  verifyToken,
};
