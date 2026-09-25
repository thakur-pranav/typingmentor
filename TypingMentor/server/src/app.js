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
  app.use(cors({ origin: env.clientUrl, credentials: true }));
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
