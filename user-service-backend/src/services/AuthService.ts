import { CreateUserInput, LoginInput, SafeUser } from "../types";
import User from "../db/models/User";
import { PasswordService } from "./PasswordService";
import { JwtService } from "./JwtService";

export class AuthService {
  static async register(userData: CreateUserInput): Promise<SafeUser> {
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error("Пользователь с таким email уже существует");
    }

    const passwordValidation = PasswordService.validatePasswordStrength(
      userData.password
    );

    if (!passwordValidation.isValid) {
      throw new Error(
        `Некорректный пароль: ${passwordValidation.errors.join(", ")}`
      );
    }

    const hashedPassword = await PasswordService.hashPassword(
      userData.password
    );

    const user = await User.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      middleName: userData.middleName,
      birthDate: userData.birthDate,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || "user",
      isActive: true,
    });

    return this.getSafeUser(user);
  }

  static async login(credentials: LoginInput): Promise<{
    user: SafeUser;
    token: string;
  }> {
    const { email, password } = credentials;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Неверный email или пароль");
    }

    if (!user.isActive) {
      throw new Error("Аккаунт заблокирован");
    }

    const isValidPassword = await PasswordService.comparePassword(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw new Error("Неверный email или пароль");
    }

    const token = JwtService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });

    return {
      user: this.getSafeUser(user),
      token,
    };
  }

  static getSafeUser(user: User): SafeUser {
    const userData = user.toJSON();
    const { password: _password, ...safeUser } = userData;
    return safeUser as SafeUser;
  }

  static async validateToken(token: string): Promise<SafeUser | null> {
    try {
      const payload = JwtService.verifyToken(token);

      if (!payload) {
        return null;
      }

      const user = await User.findByPk(payload.id);

      if (!user || !user.isActive) {
        return null;
      }

      return this.getSafeUser(user);
    } catch (error) {
      console.error("Token validation failed:", error);
      return null;
    }
  }

  static async refreshToken(oldToken: string): Promise<string> {
    const payload = JwtService.verifyToken(oldToken, true);

    if (!payload) {
      throw new Error("Invalid token");
    }

    const user = await User.findByPk(payload.id);

    if (!user || !user.isActive) {
      throw new Error("User not found or inactive");
    }

    return JwtService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  }

  static async getSafeUserFromToken(payload: any): Promise<SafeUser | null> {
    try {
      if (!payload || !payload.id) {
        return null;
      }

      const user = await User.findByPk(payload.id);
      
      if (!user) {
        return null;
      }

      if (!user.isActive) {
        return null;
      }

      return this.getSafeUser(user);
    } catch (error) {
      console.error('Error getting user from token:', error);
      return null;
    }
  }
}
