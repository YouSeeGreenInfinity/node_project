import dotenv from "dotenv";

dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 3001, // ← Исправьте порт на 3001
    nodeEnv: process.env.NODE_ENV || "development",
    corsOrigin: "http://localhost:3000", // ← Явно указываем фронтенд
  },
  database: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT || "5432"),
    name: process.env.DB_NAME || "user_service_dev",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your_default_jwt_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10"),
  },
} as const;
