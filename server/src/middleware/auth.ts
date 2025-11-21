import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  user?: { id: string; email: string; role?: string };
}

/**
 * Authentication middleware for JWT token validation
 * Validates JWT tokens from Authorization header and attaches user info to request
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * 
 * Requirements: 8.1 - JWT token validation with expiration checking
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('[Auth] Authorization header:', authHeader ? 'Present' : 'Missing');

    // Extract token from Bearer scheme
    const token = authHeader?.replace("Bearer ", "");

    // Check if token is missing
    if (!token) {
      console.log('[Auth] No token provided');
      return res.status(401).json({
        message: "Authentication required",
        error: "No token provided"
      });
    }

    // Verify token and check expiration (handled by jwt.verify)
    const decoded = verifyToken(token) as { id: string; email?: string; role?: string };

    // Validate decoded token payload
    if (!decoded || !decoded.id) {
      console.log('[Auth] Invalid token payload:', decoded);
      return res.status(401).json({
        message: "Invalid token",
        error: "Token payload is malformed"
      });
    }

    // Attach user information to request
    console.log('[Auth] Token verified for user:', decoded.id, 'role:', decoded.role);
    req.userId = decoded.id;
    req.user = { id: decoded.id, email: decoded.email || '', role: decoded.role };

    next();
  } catch (error) {
    console.error('[Auth] Token verification error:', error);

    // Handle specific JWT errors
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        message: "Token expired",
        error: "Your session has expired. Please log in again.",
        expiredAt: error.expiredAt
      });
    }

    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        message: "Invalid token",
        error: error.message
      });
    }

    // Handle other errors
    return res.status(401).json({
      message: "Authentication failed",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
