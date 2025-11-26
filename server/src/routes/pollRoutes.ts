import express from "express";
import PollResponse from "../models/PollResponse";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Submit a poll response
router.post("/submit", authenticate, async (req: AuthRequest, res) => {
    try {
        const { courseId, pollId, selectedOptions } = req.body;
        const userId = req.userId;

        console.log('[Poll Submit] Request:', { userId, courseId, pollId, selectedOptions });

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        if (!courseId || !pollId || !selectedOptions || !Array.isArray(selectedOptions)) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if user already responded to this poll
        const existingResponse = await PollResponse.findOne({
            userId,
            courseId,
            pollId,
        });

        console.log('[Poll Submit] Existing response:', existingResponse ? 'Found' : 'Not found');

        if (existingResponse) {
            // Update existing response
            existingResponse.selectedOptions = selectedOptions;
            existingResponse.submittedAt = new Date();
            await existingResponse.save();

            console.log('[Poll Submit] Updated response:', existingResponse);

            return res.json({
                message: "Poll response updated",
                response: existingResponse,
            });
        }

        // Create new response
        const pollResponse = new PollResponse({
            userId,
            courseId,
            pollId,
            selectedOptions,
        });

        await pollResponse.save();
        console.log('[Poll Submit] Created new response:', pollResponse);

        res.status(201).json({
            message: "Poll response submitted",
            response: pollResponse,
        });
    } catch (error) {
        console.error("Error submitting poll response:", error);
        res.status(500).json({ message: "Failed to submit poll response" });
    }
});

// Get poll results (aggregated data) - no auth required to view results
router.get("/results/:courseId/:pollId", async (req, res) => {
    try {
        const { courseId, pollId } = req.params;
        console.log('[Poll Results] Fetching results for:', { courseId, pollId });

        // Get all responses for this poll
        const responses = await PollResponse.find({ courseId, pollId });
        console.log('[Poll Results] Found responses:', responses.length);
        console.log('[Poll Results] Responses:', JSON.stringify(responses, null, 2));

        // Aggregate vote counts
        const voteCounts: Record<string, number> = {};
        let totalVotes = 0;

        responses.forEach((response) => {
            console.log('[Poll Results] Processing response:', response.selectedOptions);
            response.selectedOptions.forEach((optionId) => {
                voteCounts[optionId] = (voteCounts[optionId] || 0) + 1;
                totalVotes++;
            });
        });

        console.log('[Poll Results] Final vote counts:', voteCounts);

        res.json({
            totalResponses: responses.length,
            totalVotes,
            voteCounts,
        });
    } catch (error) {
        console.error("Error fetching poll results:", error);
        res.status(500).json({ message: "Failed to fetch poll results" });
    }
});

// Get user's response for a specific poll
router.get("/response/:courseId/:pollId", authenticate, async (req: AuthRequest, res) => {
    try {
        const { courseId, pollId } = req.params;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const response = await PollResponse.findOne({
            userId,
            courseId,
            pollId,
        });

        if (!response) {
            return res.json({ hasResponded: false, selectedOptions: [] });
        }

        res.json({
            hasResponded: true,
            selectedOptions: response.selectedOptions,
            submittedAt: response.submittedAt,
        });
    } catch (error) {
        console.error("Error fetching user poll response:", error);
        res.status(500).json({ message: "Failed to fetch poll response" });
    }
});

export default router;
