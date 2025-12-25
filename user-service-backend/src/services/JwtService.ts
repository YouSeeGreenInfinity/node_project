import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config";
import { UserPayload } from "../types";

export class JwtService {
  private static readonly SECRET = config.jwt.secret;

  private static readonly EXPIRES_IN = config.jwt.expiresIn;

  static generateToken(payload: UserPayload): string {
    return jwt.sign(
      payload,
      this.SECRET as jwt.Secret,
      {
        expiresIn: this.EXPIRES_IN,
        algorithm: "HS256",
      } as SignOptions
    );
  }

  static verifyToken(
    token: string,
    ignoreExpiration = false
  ): UserPayload | null {
    try {
      const payload = jwt.verify(token, this.SECRET, {
        ignoreExpiration,
      }) as UserPayload;

      return payload;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  }

  static decodeToken(token: string): UserPayload | null {
    try {
      return jwt.decode(token) as UserPayload;
    } catch (error) {
      console.error("Decoding the token without verification failed:", error);
      return null;
    }
  }

  static getPayloadFromHeader(
    authHeader: string | undefined
  ): UserPayload | null {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    return this.verifyToken(token);
  }
}
