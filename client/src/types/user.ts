// Основной тип пользователя (полный)
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  birthDate: Date;
  email: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Тип для списка пользователей (без sensitive данных)
export type SafeUser = Omit<User, "password">;

// Для регистрации
export interface RegisterData {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: Date;
  email: string;
  password: string;
  role?: "admin" | "user";
}

// Для авторизации
export interface LoginData {
  email: string;
  password: string;
}

// Для обновления профиля
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  middleName?: string | null;
  birthDate?: Date;
  email?: string;
}

// Для смены пароля
export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

// Как на сервере
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: SafeUser; // Используем SafeUser, но учтите, что сервер может присылать не все поля (см. ниже)
    token: string;
    expiresIn: number | string;
  };
}

// Для блокировки пользователя
export interface BlockUserResponse {
  id: number;
  isActive: boolean;
}