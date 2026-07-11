import mongoose from "mongoose";
import dns from "node:dns";
import { env } from "../config/env.js";

export const connectDB = async () => {
  if (env.mongoUri.startsWith("mongodb+srv://")) {
    dns.setServers(env.dnsServers);
  }

  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 15000 });
  console.log(`MongoDB conectado: ${mongoose.connection.name}`);
};
