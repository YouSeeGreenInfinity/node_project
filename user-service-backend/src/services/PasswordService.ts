import bcrypt from "bcryptjs";
import { config } from "../config";

export class PasswordService {
  private static readonly SALT_ROUNDS = config.bcrypt.saltRounds;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push("Пароль должен содержать минимум 6 символов");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Пароль должен содержать хотя бы одну заглавную букву");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Пароль должен содержать хотя бы одну строчную букву");
    }

    if (!/\d/.test(password)) {
      errors.push("Пароль должен содержать хотя бы одну цифру");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
