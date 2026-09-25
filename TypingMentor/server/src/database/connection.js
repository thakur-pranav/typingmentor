import mongoose from "mongoose";
import { env } from "../config/env.js";

let isConnected = false;

export async function connectDatabase() {
  if (isConnected) return;

  try {
    await mongoose.connect(env.mongodbUri);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}
