import JWT from "jsonwebtoken";
import { User } from "@prisma/client";
import { JWTUser } from "../intefaces";

// The signing secret comes from the environment (server/.env, loaded in
// index.ts). It is read on use, not at import time, so this module loads
// before dotenv has run. A missing value is an error: never sign with a default.
function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set. Add it to the server's .env file.");
  }
  return secret;
}


class JWTService {
  public static generateTokenForUser(user: User) {
    const payload: JWTUser = {
      id: user?.id,
      email: user?.email,
    };
    const token = JWT.sign(payload, jwtSecret());
    return token;
  }

  public static decodeToken(token: string) {
    const secret = jwtSecret();
    try {
      return JWT.verify(token, secret) as JWTUser;
    } catch (error) {
      return null;
    }
  }
}

export default JWTService;
