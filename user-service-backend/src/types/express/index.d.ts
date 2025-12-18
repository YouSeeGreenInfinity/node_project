import { UserPayload } from "../user.types";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; // Пользователь из JWT
      token?: string; // JWT токен
    }
  }
}

// Это важно для TypeScript
export {};
