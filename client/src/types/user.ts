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

export type SafeUser = Omit<User, "password">;

export interface RegisterData {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: Date;
  email: string;
  password: string;
  role?: "admin" | "user";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  middleName?: string | null;
  birthDate?: Date;
  email?: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: SafeUser;
    token: string;
    expiresIn: number | string;
  };
}

export interface BlockUserResponse {
  id: number;
  isActive: boolean;
}