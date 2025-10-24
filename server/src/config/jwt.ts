import jwt from "jsonwebtoken";

import { JWT_SECRET } from "./env";

const secret = JWT_SECRET || "";

if (!secret) {
  console.error('[JWT] JWT_SECRET is not set! Authentication will not work properly.');
}

export const generateToken = (userId: string, email: string, role: string) => {
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id: userId, email, role }, secret, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('[JWT] Token verification failed:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};
