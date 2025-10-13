import jwt from "jsonwebtoken";

import { JWT_SECRET } from "./env";

const secret = JWT_SECRET || "";

export const generateToken = (userId: string, email: string, role: string) => {
  return jwt.sign({ id: userId, email, role }, secret, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, secret);
};
