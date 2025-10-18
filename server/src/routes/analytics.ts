import { Router, Request, Response } from 'express';
import Analytics from '../models/Analytics';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/track', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, eventType, moduleId, lessonIndex, metadata } = req.body;
    
    await Analytics.create({
      userId: req.userId,
      courseId,
      eventType,
      moduleId,
      lessonIndex,
      metadata,
      timestamp: new Date()
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.query;
    
    const stats = await Analytics.aggregate([
      { $match: { courseId: courseId as string } },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const certificateCount = await Analytics.countDocuments({
      courseId,
      eventType: 'certificate_earned'
    });
    
    const aiRequestCount = await Analytics.countDocuments({
      courseId,
      eventType: 'ai_request'
    });
    
    res.json({
      stats,
      certificateCompletionRate: certificateCount,
      totalAIRequests: aiRequestCount
    });
  } catch (error) {
    console.error('Analytics stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
