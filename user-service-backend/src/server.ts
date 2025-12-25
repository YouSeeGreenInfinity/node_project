import "dotenv/config";
import App from "./app";

process.on("uncaughtException", (error: Error) => {
  console.error("💥 UNCAUGHT EXCEPTION:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error("💥 UNHANDLED REJECTION at:", promise, "reason:", reason);
  process.exit(1);
});

const gracefulShutdown = (signal: string) => {
  console.log(`\n⚠️  Received ${signal}. Starting graceful shutdown...`);

  setTimeout(() => {
    console.log("👋 Graceful shutdown complete.");
    process.exit(0);
  }, 5000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

try {
  const app = new App();
  app.listen();
} catch (error) {
  console.error("💥 Failed to start application:", error);
  process.exit(1);
}
