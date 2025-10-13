import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt";

export interface AuthRequest extends Request {
  userId?: string;
  user?: { id: string; email: string; role?: string };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token) as { id: string; email?: string; role?: string };

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.userId = decoded.id;
    req.user = { id: decoded.id, email: decoded.email || '', role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
