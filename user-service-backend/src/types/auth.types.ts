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

export interface JwtToken {
  token: string;
  expiresIn: number | string;
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: "admin" | "user";
  isActive: boolean;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenRequest {
  refreshToken?: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
  expiresIn: number;
}
