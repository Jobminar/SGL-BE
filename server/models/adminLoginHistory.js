// models/adminLoginHistory.js
import mongoose from "mongoose";

const adminLoginHistorySchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  loginTime: {
    type: Date,
    default: Date.now,
  },
});

const AdminLoginHistory = mongoose.model(
  "AdminLoginHistory",
  adminLoginHistorySchema
);

export default AdminLoginHistory;
