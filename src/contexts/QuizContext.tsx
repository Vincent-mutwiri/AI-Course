import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Quiz, Question, QuizAnswer, QuizResult } from '../types/quiz';
import { Clock } from 'lucide-react';

type QuizState = {
  quiz: Quiz | null;
  currentQuestionIndex: number;
  answers: Record<string, string | string[]>;
  timeRemaining?: number;
  status: 'not-started' | 'in-progress' | 'completed';
  result?: QuizResult;
  error?: string;
  startTime?: number;
  endTime?: number;
};

type QuizAction =
  | { type: 'START_QUIZ' }
  | { type: 'SET_QUIZ'; payload: Quiz }
  | { type: 'SET_ANSWER'; payload: { questionId: string; answer: string | string[] } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'SUBMIT_QUIZ' }
  | { type: 'SET_RESULT'; payload: QuizResult }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'UPDATE_TIME'; payload: number };

interface QuizContextType extends QuizState {
  startQuiz: () => void;
  setQuiz: (quiz: Quiz) => void;
  answerQuestion: (questionId: string, answer: string | string[]) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  submitQuiz: (answers: QuizAnswer[]) => Promise<void>;
  getCurrentQuestion: () => Question | undefined;
  getProgress: () => { current: number; total: number };
  getScore: () => number;
  isLastQuestion: () => boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'SET_QUIZ':
      return {
        ...state,
        quiz: action.payload,
        timeRemaining: action.payload.timeLimit ? action.payload.timeLimit * 60 : undefined,
      };
    case 'START_QUIZ':
      return {
        ...state,
        status: 'in-progress',
        startTime: Date.now(),
      };
    case 'SET_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answer,
        },
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.min(
          state.currentQuestionIndex + 1,
          (state.quiz?.questions.length || 1) - 1
        ),
      };
    case 'PREV_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
      };
    case 'SUBMIT_QUIZ':
      return {
        ...state,
        status: 'completed',
        endTime: Date.now(),
      };
    case 'SET_RESULT':
      return {
        ...state,
        result: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'UPDATE_TIME':
      return {
        ...state,
        timeRemaining: action.payload,
      };
    default:
      return state;
  }
};

interface QuizProviderProps {
  children: ReactNode;
  initialQuiz?: Quiz | null;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children, initialQuiz = null }) => {
  const [state, dispatch] = useReducer(quizReducer, {
    quiz: initialQuiz,
    currentQuestionIndex: 0,
    answers: {},
    status: 'not-started',
  });

  // Update the quiz when initialQuiz changes
  useEffect(() => {
    if (initialQuiz) {
      dispatch({ type: 'SET_QUIZ', payload: initialQuiz });
    }
  }, [initialQuiz]);

  const setQuiz = (quiz: Quiz) => {
    dispatch({ type: 'SET_QUIZ', payload: quiz });
  };

  const startQuiz = () => {
    dispatch({ type: 'START_QUIZ' });
  };

  const answerQuestion = (questionId: string, answer: string | string[]) => {
    dispatch({ type: 'SET_ANSWER', payload: { questionId, answer } });
  };

  const goToNextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const goToPreviousQuestion = () => {
    dispatch({ type: 'PREV_QUESTION' });
  };

  const submitQuiz = async (answers: QuizAnswer[]) => {
    if (!state.quiz) return;
    
    try {
      // In a real app, you would call your API here
      // const result = await submitQuizToApi(state.quiz.id, answers);
      // dispatch({ type: 'SET_RESULT', payload: result });
      
      // For now, we'll simulate a successful submission
      dispatch({ type: 'SUBMIT_QUIZ' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to submit quiz' });
    }
  };

  const getCurrentQuestion = (): Question | undefined => {
    return state.quiz?.questions[state.currentQuestionIndex];
  };

  const getProgress = () => ({
    current: state.currentQuestionIndex + 1,
    total: state.quiz?.questions.length || 0,
  });

  const getScore = (): number => {
    if (!state.quiz) return 0;
    
    return Object.entries(state.answers).reduce((score, [questionId, userAnswer]) => {
      const question = state.quiz?.questions.find(q => q.id === questionId);
      if (!question) return score;
      
      const isCorrect = Array.isArray(question.correctAnswer)
        ? Array.isArray(userAnswer) 
          ? question.correctAnswer.every(ans => userAnswer.includes(ans)) && 
            userAnswer.every(ans => question.correctAnswer.includes(ans))
          : false
        : userAnswer === question.correctAnswer;
      
      return isCorrect ? score + question.points : score;
    }, 0);
  };

  const isLastQuestion = (): boolean => {
    if (!state.quiz) return false;
    return state.currentQuestionIndex === state.quiz.questions.length - 1;
  };

  const value = {
    ...state,
    setQuiz,
    startQuiz,
    answerQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    submitQuiz,
    getCurrentQuestion,
    getProgress,
    getScore,
    isLastQuestion,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
