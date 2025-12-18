// Ответ при успешной авторизации
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      role: "admin" | "user";
    };
    token: string;
    expiresIn: number | string;
  };
}

// JWT токен
export interface JwtToken {
  token: string;
  expiresIn: number | string;
}

// Payload внутри JWT токена
export interface JwtPayload {
  userId: number;
  email: string;
  role: "admin" | "user";
  isActive: boolean;
  iat?: number; // issued at
  exp?: number; // expiration
}

// Для запроса обновления токена
export interface RefreshTokenRequest {
  refreshToken?: string;
}

// Ответ при обновлении токена
export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
  expiresIn: number;
}
