import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
// import helmet from "helmet";
import morgan from "morgan";

import {
  validationErrorHandler,
  authErrorHandler,
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware";

import sequelize from "./config/database";
import "./db/models/User";
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
    // this.app.use(helmet());
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

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  private initializeRoutes(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.json({
        success: true,
        message: "User Service API is running",
        timestamp: new Date().toISOString(),
        environment: this.environment,
        version: "1.0.0",
      });
    });

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
    this.app.use(notFoundHandler);

    this.app.use(validationErrorHandler);
    this.app.use(authErrorHandler);

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
