import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import { authRoutes } from "./modules/auth/index.js";
import { userRoutes } from "./modules/users/index.js";
import { typingRoutes } from "./modules/typing/index.js";
import { resultRoutes } from "./modules/results/index.js";
import { leaderboardRoutes } from "./modules/leaderboard/index.js";
import { statisticsRoutes } from "./modules/statistics/index.js";

export function createApp() {
  const app = express();

  app.use(helmet());

  const clientOrigins = (env.clientUrl || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""));

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalized = origin.replace(/\/+$/, "");
        if (clientOrigins.includes(normalized) || clientOrigins.includes("*")) {
          return callback(null, true);
        }
        if (env.nodeEnv !== "production" && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
    })
  );

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ success: true, message: "OK" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/typing", typingRoutes);
  app.use("/api/results", resultRoutes);
  app.use("/api/leaderboard", leaderboardRoutes);
  app.use("/api/statistics", statisticsRoutes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
