import { createApp } from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./database/connection";

async function bootstrap(): Promise<void> {
  await connectDatabase();
  const app = createApp();

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`TypingMentor API listening on port ${env.port} (${env.nodeEnv})`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", error);
  process.exit(1);
});
