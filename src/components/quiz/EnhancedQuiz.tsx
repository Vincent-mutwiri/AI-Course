import React, { useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, Clock, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { QuizQuestionSkeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useQuiz } from '@/contexts/QuizContext';
import QuizQuestion from './QuizQuestion';

interface EnhancedQuizProps {
  quizId: string;
  onComplete?: (result: any) => void;
}

const EnhancedQuiz: React.FC<EnhancedQuizProps> = ({ quizId, onComplete }) => {
  const {
    quiz,
    status,
    currentQuestionIndex,
    timeRemaining,
    answers,
    result,
    startQuiz,
    answerQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    submitQuiz,
    getCurrentQuestion,
    getProgress,
    getScore,
    isLastQuestion,
  } = useQuiz();

  const currentQuestion = getCurrentQuestion();
  const { current, total } = getProgress();
  const progress = Math.round((current / total) * 100);

  // Start the quiz when the component mounts
  useEffect(() => {
    if (quiz && status === 'not-started') {
      startQuiz();
    }
  }, [quiz, status, startQuiz]);

  // Timer effect
  useEffect(() => {
    if (status !== 'in-progress' || !timeRemaining) return;

    const timer = setInterval(() => {
      if (timeRemaining > 0) {
        // Update time remaining in context
        // This would be better handled in the context itself with a useInterval hook
        // but for simplicity, we're doing it here
        // In a real app, you might want to move this to the context
        // or use a more robust solution
      } else {
        // Time's up!
        clearInterval(timer);
        if (onComplete) {
          onComplete({
            score: getScore(),
            completed: false,
            timeUp: true,
          });
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, status, getScore, onComplete]);

  const handleAnswer = useCallback((answer: string | string[]) => {
    if (!currentQuestion) return;
    answerQuestion(currentQuestion.id, answer);
  }, [answerQuestion, currentQuestion]);

  const handleSubmit = useCallback(async () => {
    if (!quiz) return;
    
    const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer
    }));
    
    await submitQuiz(answersArray);
    
    if (onComplete) {
      onComplete({
        score: getScore(),
        passed: result?.passed || false,
        answers: result?.answers || [],
      });
    }
  }, [answers, getScore, onComplete, quiz, result, submitQuiz]);

  if (!quiz || !currentQuestion) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          </div>
          <div className="pt-2">
            <div className="h-2 w-full bg-muted animate-pulse rounded" />
            <div className="flex justify-between mt-1">
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
              <div className="h-3 w-16 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <QuizQuestionSkeleton />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          <div className="h-10 w-20 bg-muted animate-pulse rounded" />
        </CardFooter>
      </Card>
    );
  }

  if (status === 'completed' && result) {
    const score = getScore();
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / totalPoints) * 100);
    const passed = percentage >= quiz.passingScore;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div 
              className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full text-4xl font-bold ${
                passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}
            >
              {percentage}%
            </div>
            <h3 className="mt-4 text-xl font-semibold">
              {passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h3>
            <p className="text-muted-foreground mt-2">
              You scored {score} out of {totalPoints} points
            </p>
            {passed ? (
              <p className="mt-2 text-green-600 font-medium">
                You passed the quiz!
              </p>
            ) : (
              <p className="mt-2 text-red-600 font-medium">
                You need {quiz.passingScore}% to pass. Try again!
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Review your answers:</h4>
            {quiz.questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = result.answers.find(
                (a: any) => a.questionId === question.id
              )?.isCorrect;
              
              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">
                        {index + 1}. {question.question}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your answer: {Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer || 'Not answered'}
                      </p>
                      {!isCorrect && question.explanation && (
                        <p className="text-sm mt-2 text-blue-600">
                          <span className="font-medium">Explanation:</span> {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{quiz.title}</CardTitle>
          {timeRemaining !== undefined && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {Math.floor(timeRemaining / 60)}:{
                  (timeRemaining % 60).toString().padStart(2, '0')
                }
              </span>
            </div>
          )}
        </div>
        <div className="pt-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Question {current} of {total}</span>
            <span>{progress}% complete</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <QuizQuestion
          question={currentQuestion}
          selectedAnswer={answers[currentQuestion.id]}
          onAnswer={handleAnswer}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        
        {isLastQuestion() ? (
          <Button onClick={handleSubmit}>
            <Check className="mr-2 h-4 w-4" /> Submit Quiz
          </Button>
        ) : (
          <Button onClick={goToNextQuestion}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EnhancedQuiz;
