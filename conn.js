// conn.js
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const connectToMongoDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    await mongoose.connect(MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    mongoose.connection.once("open", () => {
      // console.log("MongoDB connected successfully");
      console.log(`MongoDB connected at ${process.env.MONGODB_URI}`);
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("reconnect", () => {
      console.log("MongoDB reconnected");
    });

    // console.log("MongoDB connected successfully");
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
