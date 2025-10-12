export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number; // in minutes
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
}

export interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  answers: {
    questionId: string;
    userAnswer: string | string[];
    correctAnswer: string | string[];
    isCorrect: boolean;
    explanation: string;
  }[];
}
