import mongoose from "mongoose";
import { env } from "../config/env";

let isConnected = false;

export async function connectDatabase(): Promise<void> {
  if (isConnected) return;

  try {
    await mongoose.connect(env.mongodbUri);
    isConnected = true;
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
  } catch (error) {
    // Fail loudly and clearly: the app cannot run without a database.
    // eslint-disable-next-line no-console
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}
