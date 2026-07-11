import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI,
  dnsServers: (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1").split(",").map((server) => server.trim()).filter(Boolean),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

export const validateEnv = () => {
  const missing = ["MONGODB_URI", "JWT_SECRET"].filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Variables de entorno faltantes: ${missing.join(", ")}`);
};
