import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";
import User from "../models/User";

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('[Admin] Checking admin access for user:', req.userId);
    const user = await User.findById(req.userId);
    
    if (!user) {
      console.log('[Admin] User not found:', req.userId);
      return res.status(403).json({ message: "User not found" });
    }
    
    if (user.role !== "admin") {
      console.log('[Admin] Access denied. User role:', user.role);
      return res.status(403).json({ message: "Admin access required", userRole: user.role });
    }
    
    console.log('[Admin] Admin access granted for user:', req.userId);
    next();
  } catch (error) {
    console.error('[Admin] Error checking admin access:', error);
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
