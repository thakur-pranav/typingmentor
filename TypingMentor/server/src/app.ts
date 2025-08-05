import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/notFound.middleware";
import { authRoutes } from "./modules/auth";
import { userRoutes } from "./modules/users";
import { typingRoutes } from "./modules/typing";
import { resultRoutes } from "./modules/results";
import { leaderboardRoutes } from "./modules/leaderboard";
import { statisticsRoutes } from "./modules/statistics";

export function createApp(): Application {
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
