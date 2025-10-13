import { Router, Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../config/jwt";
import { authenticate, AuthRequest } from "../middleware/auth";
import crypto from "crypto";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id.toString(), user.email, user.role);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString(), user.email, user.role);

    res.json({
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/verify", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // TODO: Send email with reset link
    // For now, return token in response (in production, send via email)
    res.json({ 
      message: "Password reset token generated",
      resetToken, // Remove this in production
      resetUrl: `http://localhost:5173/reset-password/${resetToken}`
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
