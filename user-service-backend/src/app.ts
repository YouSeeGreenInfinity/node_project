import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
// import helmet from "helmet";
import morgan from "morgan";
// Middleware для обработки ошибок (используются ниже)
import {
  validationErrorHandler,
  authErrorHandler,
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware";

// Импорты для базы данных
import sequelize from "./config/database";
import "./db/models/User"; // Импортируем модель для регистрации
import apiRoutes from "./routes";

class App {
  public app: Application;

  public port: string | number;

  public environment: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.environment = process.env.NODE_ENV || "development";

    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connection established successfully.");

      // Синхронизация только в режиме разработки
      if (this.environment === "development") {
        await sequelize.sync({ alter: true });
        console.log("✅ Database synchronized.");
      }
    } catch (error) {
      console.error("❌ Unable to connect to the database:", error);
      process.exit(1);
    }
  }

  private initializeMiddlewares(): void {
    // Базовые middleware
    // this.app.use(helmet()); // Безопасность заголовков
    this.app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );
    this.app.use(
      morgan(this.environment === "development" ? "dev" : "combined")
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Логирование запросов
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // Тестовый маршрут
    this.app.get("/", (req: Request, res: Response) => {
      res.json({
        success: true,
        message: "User Service API is running",
        timestamp: new Date().toISOString(),
        environment: this.environment,
        version: "1.0.0",
      });
    });

    // Маршрут состояния здоровья
    this.app.get("/health", async (req: Request, res: Response) => {
      try {
        await sequelize.authenticate();

        res.json({
          success: true,
          message: "Service is healthy",
          timestamp: new Date().toISOString(),
          database: "connected",
          environment: this.environment,
        });
      } catch (error) {
        res.status(503).json({
          success: false,
          message: "Service is unhealthy",
          timestamp: new Date().toISOString(),
          database: "disconnected",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    });

    this.app.use("/api", apiRoutes);
  }

  private initializeErrorHandling(): void {
    // 404 handler - для всех необработанных маршрутов
    this.app.use(notFoundHandler);

    // Специфичные обработчики ошибок
    this.app.use(validationErrorHandler);
    this.app.use(authErrorHandler);

    // Глобальный обработчик ошибок - ПОСЛЕДНИМ
    this.app.use(globalErrorHandler);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`
🚀 Server is running!
📍 Port: ${this.port}
🌍 Environment: ${this.environment}
📅 Time: ${new Date().toISOString()}
📊 Database: PostgreSQL
👉 Health check: http://localhost:${this.port}/health
👉 API v1: http://localhost:${this.port}/api/v1
      `);
    });
  }
}

export default App;
