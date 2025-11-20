import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/simulations/roe-data
// Returns mock ROE (Return on Engagement) metrics data
// TODO: Future enhancement - migrate to real MongoDB aggregation from Analytics collection
router.get('/roe-data', async (req: Request, res: Response) => {
    try {
        // Mock data representing monthly engagement metrics
        // In production, this would aggregate real data from the Analytics model
        const mockROEData = [
            {
                month: 'Jan',
                enrollments: 120,
                completions: 45,
                aiRequests: 380,
                timeSpent: 2400 // in minutes
            },
            {
                month: 'Feb',
                enrollments: 150,
                completions: 68,
                aiRequests: 520,
                timeSpent: 3100
            },
            {
                month: 'Mar',
                enrollments: 180,
                completions: 92,
                aiRequests: 680,
                timeSpent: 4200
            },
            {
                month: 'Apr',
                enrollments: 210,
                completions: 115,
                aiRequests: 850,
                timeSpent: 5300
            },
            {
                month: 'May',
                enrollments: 240,
                completions: 145,
                aiRequests: 1020,
                timeSpent: 6500
            },
            {
                month: 'Jun',
                enrollments: 280,
                completions: 178,
                aiRequests: 1250,
                timeSpent: 7800
            }
        ];

        res.json(mockROEData);
    } catch (error) {
        console.error('ROE data fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch ROE data' });
    }
});

export default router;
