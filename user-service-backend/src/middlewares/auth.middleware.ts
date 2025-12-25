import { Request, Response, NextFunction } from "express";
import { JwtService } from "../services/JwtService";
import { ErrorResponse } from "../types/api.types";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "Токен не предоставлен",
        error: "Authorization header is missing",
        timestamp: new Date(),
      };
      return res.status(401).json(errorResponse);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "Неверный формат токена",
        error: "Token is missing in Authorization header",
        timestamp: new Date(),
      };
      return res.status(401).json(errorResponse);
    }

    const payload = JwtService.verifyToken(token);

    if (!payload) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "Недействительный или просроченный токен",
        error: "Invalid or expired token",
        timestamp: new Date(),
      };
      return res.status(401).json(errorResponse);
    }

    if (!payload.isActive) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "Аккаунт заблокирован",
        error: "User account is deactivated",
        timestamp: new Date(),
      };
      return res.status(403).json(errorResponse);
    }

    const authenticatedReq = req as Request & {
      user?: typeof payload;
      token?: string;
    };

    authenticatedReq.user = payload;
    authenticatedReq.token = token;

    next();
  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "Ошибка аутентификации",
      error: error instanceof Error ? error.message : "Authentication error",
      timestamp: new Date(),
    };
    res.status(500).json(errorResponse);
  }
};

export const requireRole =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedReq = req as Request & {
        user?: { role: string };
      };

      if (!authenticatedReq.user) {
        const errorResponse: ErrorResponse = {
          success: false,
          message: "Требуется аутентификация",
          error: "Authentication required",
          timestamp: new Date(),
        };
        return res.status(401).json(errorResponse);
      }

      if (!allowedRoles.includes(authenticatedReq.user.role)) {
        const errorResponse: ErrorResponse = {
          success: false,
          message: "Недостаточно прав",
          error: `Required roles: ${allowedRoles.join(", ")}. Your role: ${authenticatedReq.user.role}`,
          timestamp: new Date(),
        };
        return res.status(403).json(errorResponse);
      }

      next();
    } catch (error) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "Ошибка проверки прав",
        error: error instanceof Error ? error.message : "Authorization error",
        timestamp: new Date(),
      };
      res.status(500).json(errorResponse);
    }
  };

export const requireOwnershipOrAdmin =
  (paramName = "id") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedReq = req as Request & {
        user?: { id: number; role: string };
      };

      if (!authenticatedReq.user) {
        const errorResponse: ErrorResponse = {
          success: false,
          message: "Требуется аутентификация",
          error: "Authentication required",
          timestamp: new Date(),
        };
        return res.status(401).json(errorResponse);
      }

      const resourceId = parseInt(req.params[paramName], 10);

      if (authenticatedReq.user.role === "admin") {
        return next();
      }

      if (authenticatedReq.user.id !== resourceId) {
        const errorResponse: ErrorResponse = {
          success: false,
          message: "Доступ запрещен",
          error: "You can only access your own resources",
          timestamp: new Date(),
        };
        return res.status(403).json(errorResponse);
      }

      next();
    } catch (error) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "Ошибка проверки доступа",
        error: error instanceof Error ? error.message : "Access control error",
        timestamp: new Date(),
      };
      res.status(500).json(errorResponse);
    }
  };
