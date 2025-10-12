import api from './api';
import { Quiz, QuizAnswer, QuizResult } from '../types/quiz';

export const fetchQuiz = async (quizId: string): Promise<Quiz> => {
  const response = await api.get(`/api/quiz/${quizId}`);
  return response.data;
};

export const submitQuiz = async (
  quizId: string, 
  answers: QuizAnswer[]
): Promise<QuizResult> => {
  const response = await api.post(`/api/quiz/${quizId}/submit`, { answers });
  return response.data;
};

// Helper function to calculate initial quiz state
export const initializeQuizState = (quiz: Quiz) => {
  return {
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: quiz.timeLimit ? quiz.timeLimit * 60 : undefined,
    status: 'not-started' as 'not-started' | 'in-progress' | 'completed',
    startTime: 0,
    endTime: 0,
  };
};
