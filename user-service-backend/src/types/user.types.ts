// Базовые типы для пользователя
export interface BaseUser {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  email: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Пользователь без конфиденциальных данных (для ответов)
export type SafeUser = Omit<BaseUser, "password">;
// Уже без пароля

// Для создания пользователя (регистрация)
export interface CreateUserInput {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: Date;
  email: string;
  password: string;
  role?: "admin" | "user";
}

// Для обновления пользователя
export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  middleName?: string | null;
  birthDate?: Date;
  email?: string;
  password?: string;
  isActive?: boolean;
}

// Для авторизации (логин)
export interface LoginInput {
  email: string;
  password: string;
}

// Для смены пароля
export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

// Тип для JWT payload
export interface UserPayload {
  id: number;
  email: string;
  role: "admin" | "user";
  isActive: boolean;
}
