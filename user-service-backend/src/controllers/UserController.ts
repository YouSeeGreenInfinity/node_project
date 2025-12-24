import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { SuccessResponse, PaginatedResponse } from "../types/api.types";

export class UserController {
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await UserService.getUserById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "Пользователь не найден",
          error: "User not found",
          timestamp: new Date(),
        });
        return;
      }

      const response: SuccessResponse = {
        success: true,
        message: "Пользователь найден",
        data: { user },
        timestamp: new Date(),
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: errorMessage,
        error: "Get user failed",
        timestamp: new Date(),
      });
    }
  }

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, role, isActive } = req.query;

      const result = await UserService.getAllUsers({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        role: role as "admin" | "user" | undefined,
        isActive:
          isActive === "true" ? true : isActive === "false" ? false : undefined,
      });

      const response: PaginatedResponse = {
        success: true,
        message: "Список пользователей получен",
        data: result.users,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          hasNext: result.page < result.totalPages,
          hasPrev: result.page > 1,
        },
        timestamp: new Date(),
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: errorMessage,
        error: "Get users failed",
        timestamp: new Date(),
      });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const updateData = req.body;

      const user = await UserService.updateUser(userId, updateData);

      const response: SuccessResponse = {
        success: true,
        message: "Пользователь успешно обновлен",
        data: { user },
        timestamp: new Date(),
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const statusCode = errorMessage.includes("не найден") ? 404 : 400;

      res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: "Update user failed",
        timestamp: new Date(),
      });
    }
  }

  static async toggleUserBlock(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      console.log("toggleUserBlock body:", req.body);
      const { isActive } = req.body;

      if (typeof isActive !== "boolean") {
        res.status(400).json({
          success: false,
          message: "Поле isActive должно быть boolean",
          error: "Invalid isActive value",
          timestamp: new Date(),
        });
        return;
      }

      const user = await UserService.toggleUserBlock(userId, isActive);

      const action = isActive ? "разблокирован" : "заблокирован";
      const response: SuccessResponse = {
        success: true,
        message: `Пользователь успешно ${action}`,
        data: { user },
        timestamp: new Date(),
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const statusCode = errorMessage.includes("не найден")
        ? 404
        : errorMessage.includes("Нельзя заблокировать")
          ? 403
          : 400;

      res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: "Toggle user block failed",
        timestamp: new Date(),
      });
    }
  }

  static async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const { oldPassword, newPassword } = req.body;

      await UserService.changePassword(userId, oldPassword, newPassword);

      const response: SuccessResponse = {
        success: true,
        message: "Пароль успешно изменен",
        data: null,
        timestamp: new Date(),
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const statusCode = errorMessage.includes("не найден")
        ? 404
        : errorMessage.includes("неверен")
          ? 400
          : 500;

      res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: "Change password failed",
        timestamp: new Date(),
      });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);

      await UserService.deleteUser(userId);

      const response: SuccessResponse = {
        success: true,
        message: "Пользователь успешно удален",
        data: null,
        timestamp: new Date(),
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const statusCode = errorMessage.includes("не найден")
        ? 404
        : errorMessage.includes("Нельзя удалить")
          ? 403
          : 500;

      res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: "Delete user failed",
        timestamp: new Date(),
      });
    }
  }
}
