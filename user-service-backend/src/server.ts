import "dotenv/config";
import App from "./app";

// Обработка необработанных исключений
process.on("uncaughtException", (error: Error) => {
  console.error("💥 UNCAUGHT EXCEPTION:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error("💥 UNHANDLED REJECTION at:", promise, "reason:", reason);
  process.exit(1);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n⚠️  Received ${signal}. Starting graceful shutdown...`);

  // Даем время завершить текущие запросы
  setTimeout(() => {
    console.log("👋 Graceful shutdown complete.");
    process.exit(0);
  }, 5000);
};

// Обработка сигналов завершения
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Запуск приложения
try {
  const app = new App();
  app.listen();
} catch (error) {
  console.error("💥 Failed to start application:", error);
  process.exit(1);
}
