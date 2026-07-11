import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env, validateEnv } from "./src/config/env.js";
import { swaggerSpec } from "./src/config/swagger.js";
import { connectDB } from "./src/db/connection.js";
import { errorHandler, notFound } from "./src/middleware/error.js";
import routes from "./src/routes/index.js";

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.get("/", (_req, res) =>
  res.json({
    success: true,
    message: "Bienvenido a BarberShop API",
    data: { docs: "/api-docs" },
  }),
);
app.get("/api/health", (_req, res) =>
  res.json({
    success: true,
    message: "API de barberia funcionando",
    data: { environment: env.nodeEnv },
  }),
);
app.get("/api-docs.json", (_req, res) => res.json(swaggerSpec));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

const start = async () => {
  validateEnv();
  await connectDB();
  app.listen(env.port, () =>
    console.log(
      `Servidor ejecutandose en http://localhost:${env.port}\nSwagger: http://localhost:${env.port}/api-docs`,
    ),
  );
};
start().catch((error) => {
  console.error("No se pudo iniciar la API:", error.message);
  process.exit(1);
});
