import { Router, Response } from "express";
import Quiz from "../models/Quiz";
import QuizAttempt from "../models/QuizAttempt";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/:quizId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const quizData = quiz.toObject();
    quizData.questions = quizData.questions.map((q: any) => ({
      question: q.question,
      options: q.options.map((o: any) => ({ text: o.text })),
    }));

    res.json({ quiz: quizData });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:quizId/submit", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const results = answers.map((answer: any, index: number) => {
      const question = quiz.questions[index];
      const isCorrect = question.options[answer.selectedOption]?.isCorrect || false;
      return {
        questionIndex: index,
        selectedOption: answer.selectedOption,
        isCorrect,
      };
    });

    const correctAnswers = results.filter((r: any) => r.isCorrect).length;
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const attempt = await QuizAttempt.create({
      userId: req.userId,
      quizId: quiz._id,
      answers: results,
      score,
      passed,
    });

    res.json({
      attempt: {
        score,
        passed,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        results: results.map((r: any, index: number) => ({
          ...r,
          explanation: quiz.questions[index].explanation,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:quizId/attempts", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const attempts = await QuizAttempt.find({
      userId: req.userId,
      quizId: req.params.quizId,
    }).sort({ completedAt: -1 });

    res.json({ attempts });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
