import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectToMongoDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    mongoose.connect(MONGODB_URI, {
      tls: true,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("MongoDB disconnected through app termination");
    process.exit(0);
  });
});

export default connectToMongoDB;
