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
    const authHeader = req.headers.authorization;
    console.log('[Auth] Authorization header:', authHeader ? 'Present' : 'Missing');
    
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      console.log('[Auth] No token provided');
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token) as { id: string; email?: string; role?: string };

    if (!decoded || !decoded.id) {
      console.log('[Auth] Invalid token payload:', decoded);
      return res.status(401).json({ message: "Invalid token payload" });
    }

    console.log('[Auth] Token verified for user:', decoded.id, 'role:', decoded.role);
    req.userId = decoded.id;
    req.user = { id: decoded.id, email: decoded.email || '', role: decoded.role };
    next();
  } catch (error) {
    console.error('[Auth] Token verification error:', error);
    res.status(401).json({ message: "Invalid token", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
