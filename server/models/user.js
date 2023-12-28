// models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  // Add other user-specific fields as needed
});

const User = mongoose.model("User", userSchema);

export default User;
