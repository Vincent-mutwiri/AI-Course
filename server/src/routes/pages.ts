import { Router, Request, Response } from "express";
import Page from "../models/Page";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt";

const router = Router();

/**
 * GET /api/pages/:slug
 * Fetch a page by slug for public viewing
 * - Returns published pages to all users
 * - Returns unpublished pages only to admins
 * - Returns 404 for non-existent pages
 * - Returns 403 for unpublished pages accessed by non-admins
 */
router.get("/:slug", async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        // Find page by slug
        const page = await Page.findOne({ slug });

        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }

        // Check if user is authenticated and is admin
        let isAdmin = false;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.substring(7);
                const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

                if (decoded.userId) {
                    const user = await User.findById(decoded.userId);
                    isAdmin = user?.role === 'admin';
                }
            } catch (error) {
                // Token invalid or expired, continue as non-admin
                console.log('Token validation failed:', error);
            }
        }

        // If page is not published and user is not admin, return 403
        if (!page.isPublished && !isAdmin) {
            return res.status(403).json({
                message: "This page is not published"
            });
        }

        // Return page with admin flag
        res.json({
            page,
            isAdmin
        });

    } catch (error) {
        console.error("[Pages] Error fetching page by slug:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
