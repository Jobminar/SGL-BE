import mongoose from "mongoose";
import AdminLoginHistory from "./adminLoginHistory.js";

// Create a admin schema
const adminSchema = new mongoose.Schema({
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
  },
  otpExpire: {
    type: Date,
  },
  loginHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminLoginHistory",
    },
  ],
});

// Create a admin model
const Admin = mongoose.model("Admin", adminSchema);

// Export the admin model
export default Admin;
