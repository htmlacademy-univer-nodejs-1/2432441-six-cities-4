import jwt from "jsonwebtoken";

type JwtPayload = {
  id: string;
};

const signOptions: jwt.SignOptions = {
  expiresIn: "1d",
};

export function encodeToken(secret: string, payload: JwtPayload): string {
  return jwt.sign(payload, secret, signOptions);
}

export function decodeToken(secret: string, token: string): JwtPayload {
  return jwt.verify(token, secret) as JwtPayload;
}
