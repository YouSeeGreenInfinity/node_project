// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ErrorResponse, ValidationErrorResponse } from "../types/api.types";
import { config } from "../config";

/**
 * Кастомный класс для ошибок приложения
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Middleware для обработки ошибок валидации
 */
export const validationErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    error.name === "ValidationError" ||
    error.name === "SequelizeValidationError"
  ) {
    const errors = Array.isArray(error.errors)
      ? error.errors.map((err: any) => ({
          field: err.path || err.field,
          message: err.message,
        }))
      : [{ field: "unknown", message: error.message }];

    const errorResponse: ValidationErrorResponse = {
      success: false,
      message: "Ошибка валидации",
      error: "Validation failed",
      errors,
      timestamp: new Date(),
    };

    return res.status(400).json(errorResponse);
  }

  next(error);
};

/**
 * Middleware для обработки ошибок аутентификации/авторизации
 */
export const authErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.name === "JsonWebTokenError") {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "Недействительный токен",
      error: "Invalid token",
      timestamp: new Date(),
    };
    return res.status(401).json(errorResponse);
  }

  if (error.name === "TokenExpiredError") {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "Токен истёк",
      error: "Token expired",
      timestamp: new Date(),
    };
    return res.status(401).json(errorResponse);
  }

  next(error);
};

/**
 * Глобальный обработчик ошибок
 */
export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Временный кастинг типа
  const authenticatedReq = req as Request & { user?: { id: number } };

  console.error("❌ Error:", {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    user: authenticatedReq.user?.id, // Используем кастинг
  });

  // Если уже отправили ответ
  if (res.headersSent) {
    return next(error);
  }

  // Обработка кастомных ошибок AppError
  if (error instanceof AppError) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: error.message,
      error: error.code || "Application error",
      timestamp: new Date(),
    };
    return res.status(error.statusCode).json(errorResponse);
  }

  // Обработка обычных ошибок
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  const errorResponse: ErrorResponse = {
    success: false,
    message,
    error:
      config.server.nodeEnv === "development"
        ? error.message
        : "Something went wrong",
    timestamp: new Date(),
  };

  res.status(statusCode).json(errorResponse);
};

/**
 * Middleware для обработки 404
 */
export const notFoundHandler = (req: Request, res: Response) => {
  const errorResponse: ErrorResponse = {
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: "Not Found",
    timestamp: new Date(),
  };
  res.status(404).json(errorResponse);
};
