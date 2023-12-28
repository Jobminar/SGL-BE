// controllers/user.js
import jwt from "jsonwebtoken";
import { sendMessage } from "fast-two-sms";
import User from "../models/user.js";

const secret = "your-secret-key";
const { sign, verify } = jwt;
const { findOne, findById } = User;

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const sendOTP = async (phone, otp) => {
  // Replace with your own API key from https://www.fast2sms.com/
  const apiKey = "your-api-key";
  const message = `Your OTP for login is ${otp}`;
  const response = await sendMessage({
    authorization: apiKey,
    message: message,
    numbers: [phone],
  });
  return response;
};

const registerUser = async (req, res) => {
  try {
    const { phone, name } = req.body;

    if (!phone || !name) {
      return res.status(400).json({ message: "Phone and name are required" });
    }

    const user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ phone, name });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    // Check if the user is also an admin
    const admin = await admin.findOne({ phone });

    if (admin) {
      // If the user is also an admin, perform admin login logic
      // (You can customize this part based on your admin login logic)
      const adminOtp = generateOTP();
      const adminResponse = await sendOTP(phone, adminOtp);
      console.log(adminResponse);

      admin.otp = adminOtp;
      admin.otpExpire = Date.now() + 300000; // OTP expires in 5 minutes
      await admin.save();

      return res
        .status(200)
        .json({ message: "OTP sent for admin login", adminId: admin.id });
    }

    // If the user is not an admin, proceed with regular user login logic
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const response = await sendOTP(phone, otp);
    console.log(response);

    user.otp = otp;
    user.otpExpire = Date.now() + 300000; // OTP expires in 5 minutes
    await user.save();

    res.status(200).json({ message: "OTP sent", userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyUserOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "User id and OTP are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp === otp && user.otpExpire > Date.now()) {
      const token = sign({ phone: user.phone, name: user.name }, secret, {
        expiresIn: "1h",
      });

      user.otp = null;
      user.otpExpire = null;
      await user.save();

      res.status(200).json({ message: "OTP verified", token: token });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getUserProfile = (req, res) => {
  try {
    const { phone, name } = req.user;

    res.status(200).json({ phone, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyUserToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = verify(token, secret);
      req.user = { phone: decoded.phone, name: decoded.name };

      // Check if the user is also an admin
      if (decoded.isAdmin) {
        return res.redirect("/admin/login"); // Redirect to admin login
      }

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
  registerUser,
  loginUser,
  verifyUserOTP,
  getUserProfile,
  verifyUserToken,
};
