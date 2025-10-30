import express from 'express';
import InstructorProfile from '../models/InstructorProfile';

const router = express.Router();

// @route   GET /api/profile
// @desc    Get instructor profile
// @access  Public
router.get('/', async (req, res) => {
  try {
    // FindOne since there should only be one profile
    const profile = await InstructorProfile.findOne();
    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
