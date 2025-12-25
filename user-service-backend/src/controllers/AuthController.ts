import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { JwtService } from "../services/JwtService";
import { SuccessResponse } from "../types/api.types";
import { UserService } from "../services/UserService";

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await AuthService.register(req.body);
      const token = JwtService.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });

      const response: SuccessResponse = {
        success: true,
        message: "Пользователь успешно зарегистрирован",
        data: { user, token, expiresIn: "24h" },
        timestamp: new Date(),
      };
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Ошибка регистрации",
        error: "Registration failed",
        timestamp: new Date(),
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { user, token } = await AuthService.login(req.body);
      const response: SuccessResponse = {
        success: true,
        message: "Авторизация успешна",
        data: { user, token, expiresIn: "24h" },
        timestamp: new Date(),
      };
      res.status(200).json(response);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : "Ошибка авторизации",
        error: "Authentication failed",
        timestamp: new Date(),
      });
    }
  }

  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
            const authenticatedReq = req as Request & {
        user?: { id: number };
      };

      if (!authenticatedReq.user) {
        throw new Error("Пользователь не авторизован");
      }

      const user = await UserService.getUserById(authenticatedReq.user.id);

      if (!user) {
        throw new Error("Пользователь не найден");
      }

      const response: SuccessResponse = {
        success: true,
        message: "Данные пользователя получены",
        data: { user },
        timestamp: new Date(),
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(401).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Ошибка получения пользователя",
        error: "Get user failed",
        timestamp: new Date(),
      });
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new Error("Токен не предоставлен");
      }

      const token = authHeader.split(" ")[1];
      const newToken = await AuthService.refreshToken(token);

      const response: SuccessResponse = {
        success: true,
        message: "Токен обновлен",
        data: {
          token: newToken,
          expiresIn: "24h",
        },
        timestamp: new Date(),
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(401).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Ошибка обновления токена",
        error: "Token refresh failed",
        timestamp: new Date(),
      });
    }
  }
}
