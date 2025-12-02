import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import Reflection from '../models/Reflection';
import User from '../models/User';

const router = Router();

// Save a reflection
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { courseId, moduleId, question, answer, isPublic = true } = req.body;
        const userId = req.userId;

        if (!courseId || !moduleId || !question || !answer) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const reflection = new Reflection({
            userId,
            courseId,
            moduleId,
            question,
            answer,
            isPublic
        });

        await reflection.save();

        res.status(201).json(reflection);
    } catch (error: any) {
        console.error('Error saving reflection:', error);
        res.status(500).json({ message: 'Failed to save reflection' });
    }
});

// Get reflections for a specific question
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { question, limit = 10 } = req.query;

        if (!question) {
            return res.status(400).json({ message: 'Question parameter is required' });
        }

        const reflections = await Reflection.find({
            question: question as string,
            isPublic: true
        })
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .populate('userId', 'name avatar'); // Populate user details

        res.json(reflections);
    } catch (error: any) {
        console.error('Error fetching reflections:', error);
        res.status(500).json({ message: 'Failed to fetch reflections' });
    }
});

export default router;
