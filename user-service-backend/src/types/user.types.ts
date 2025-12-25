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

export type SafeUser = Omit<BaseUser, "password">;

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: Date;
  email: string;
  password: string;
  role?: "admin" | "user";
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  middleName?: string | null;
  birthDate?: Date;
  email?: string;
  password?: string;
  isActive?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface UserPayload {
  id: number;
  email: string;
  role: "admin" | "user";
  isActive: boolean;
}
