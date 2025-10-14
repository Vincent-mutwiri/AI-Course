import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

export const QuizComponent = ({ quiz }: { quiz: any }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | number[] | boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!quiz?.questions?.length) return null;

  const question = quiz.questions[currentQuestion];

  const handleSubmit = () => {
    const isCorrect = Array.isArray(question.correct)
      ? JSON.stringify(selectedAnswer) === JSON.stringify(question.correct)
      : selectedAnswer === question.correct;

    if (isCorrect) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-2xl font-bold mb-4">Quiz Complete! 🎉</h3>
        <p className="text-lg mb-4">
          Your Score: {score} / {quiz.questions.length}
        </p>
        <p className="text-muted-foreground mb-6">
          {score === quiz.questions.length
            ? "Perfect! You've mastered this lesson."
            : score >= quiz.questions.length * 0.7
            ? "Great job! You have a solid understanding."
            : "Keep learning! Review the lesson and try again."}
        </p>
        <Button onClick={handleReset}>Retake Quiz</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Knowledge Check</h3>
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </span>
      </div>

      <div className="mb-6">
        <p className="font-medium mb-4">{question.question}</p>

        {question.type === "multiple_choice" && (
          <div className="space-y-2">
            {question.options.map((option: string, idx: number) => (
              <button
                key={idx}
                onClick={() => !showExplanation && setSelectedAnswer(idx)}
                disabled={showExplanation}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selectedAnswer === idx
                    ? showExplanation
                      ? idx === question.correct
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${showExplanation ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-center gap-2">
                  {showExplanation && idx === question.correct && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  {showExplanation && selectedAnswer === idx && idx !== question.correct && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="text-sm">{option}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {question.type === "true_false" && (
          <div className="space-y-2">
            {[true, false].map((value) => (
              <button
                key={String(value)}
                onClick={() => !showExplanation && setSelectedAnswer(value)}
                disabled={showExplanation}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selectedAnswer === value
                    ? showExplanation
                      ? value === question.correct
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${showExplanation ? "cursor-default" : "cursor-pointer"}`}
              >
                {value ? "True" : "False"}
              </button>
            ))}
          </div>
        )}

        {question.type === "scenario" && (
          <div className="space-y-2">
            {question.options.map((option: string, idx: number) => (
              <button
                key={idx}
                onClick={() => !showExplanation && setSelectedAnswer(idx)}
                disabled={showExplanation}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selectedAnswer === idx
                    ? showExplanation
                      ? idx === question.correct
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${showExplanation ? "cursor-default" : "cursor-pointer"}`}
              >
                <span className="text-sm">{option}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {showExplanation && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm font-medium mb-1">Explanation:</p>
          <p className="text-sm text-muted-foreground">{question.explanation}</p>
        </div>
      )}

      <div className="flex gap-2">
        {!showExplanation ? (
          <Button onClick={handleSubmit} disabled={selectedAnswer === null} className="flex-1">
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="flex-1">
            {currentQuestion < quiz.questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        )}
      </div>
    </Card>
  );
};
