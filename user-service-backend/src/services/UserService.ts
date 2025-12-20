import { UpdateUserInput, SafeUser } from "../types";
import User from "../db/models/User";
import { PasswordService } from "./PasswordService";
import { AuthService } from "./AuthService";

export class UserService {
  /**
   * Получение пользователя по ID
   */
  static async getUserById(id: number): Promise<SafeUser | null> {
    const user = await User.findByPk(id);

    if (!user) {
      return null;
    }

    return AuthService.getSafeUser(user);
  }

  /**
   * Получение пользователя по email
   */
  static async getUserByEmail(email: string): Promise<SafeUser | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    return AuthService.getSafeUser(user);
  }

  /**
   * Получение списка всех пользователей
   */
  static async getAllUsers(
    options: {
      page?: number;
      limit?: number;
      role?: "admin" | "user";
      isActive?: boolean;
    } = {}
  ): Promise<{
    users: SafeUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (options.role) {
      where.role = options.role;
    }

    if (options.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    const { rows: users, count: total } = await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const safeUsers = users.map((user) => AuthService.getSafeUser(user));

    return {
      users: safeUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Обновление пользователя
   */
  static async updateUser(
    userId: number,
    updateData: UpdateUserInput
  ): Promise<SafeUser> {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    // Если обновляется пароль - хешируем его
    if (updateData.password) {
      const passwordValidation = PasswordService.validatePasswordStrength(
        updateData.password
      );

      if (!passwordValidation.isValid) {
        throw new Error(
          `Некорректный пароль: ${passwordValidation.errors.join(", ")}`
        );
      }

      updateData.password = await PasswordService.hashPassword(
        updateData.password
      );
    }

    // Обновляем пользователя
    await user.update(updateData);

    return AuthService.getSafeUser(user);
  }

  /**
   * Блокировка/разблокировка пользователя
   */
  static async toggleUserBlock(
    userId: number,
    isActive: boolean
  ): Promise<SafeUser> {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    // Админа нельзя заблокировать
    if (user.role === "admin" && !isActive) {
      throw new Error("Нельзя заблокировать администратора");
    }

    await user.update({ isActive });

    return AuthService.getSafeUser(user);
  }

  /**
   * Смена пароля
   */
  static async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    // Проверяем старый пароль
    const isValidPassword = await PasswordService.comparePassword(
      oldPassword,
      user.password
    );

    if (!isValidPassword) {
      throw new Error("Текущий пароль неверен");
    }

    // Проверяем сложность нового пароля
    const passwordValidation =
      PasswordService.validatePasswordStrength(newPassword);

    if (!passwordValidation.isValid) {
      throw new Error(
        `Некорректный пароль: ${passwordValidation.errors.join(", ")}`
      );
    }

    // Хешируем и сохраняем новый пароль
    const hashedPassword = await PasswordService.hashPassword(newPassword);
    await user.update({ password: hashedPassword });
  }

  /**
   * Удаление пользователя
   */
  static async deleteUser(userId: number): Promise<void> {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    // Админа нельзя удалить
    if (user.role === "admin") {
      throw new Error("Нельзя удалить администратора");
    }

    await user.destroy();
  }
}
