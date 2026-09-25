import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./database/connection.js";

async function bootstrap() {
  await connectDatabase();
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`TypingMentor API listening on port ${env.port} (${env.nodeEnv})`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
