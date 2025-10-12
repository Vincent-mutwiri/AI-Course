import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { quizAPI } from "@/services/api";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizProps {
  quizId: string;
  quiz: {
    title: string;
    questions: Array<{
      question: string;
      options: Array<{ text: string }>;
    }>;
    passingScore: number;
  };
}

export default function Quiz({ quizId, quiz }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formattedAnswers = answers.map((selectedOption) => ({ selectedOption }));
      const { attempt } = await quizAPI.submitQuiz(quizId, formattedAnswers);
      setResults(attempt);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit quiz", error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted && results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${results.passed ? "text-green-600" : "text-red-600"}`}>
              {results.score}%
            </div>
            <p className="text-muted-foreground mt-2">
              {results.correctAnswers} out of {results.totalQuestions} correct
            </p>
            <p className={`mt-2 font-semibold ${results.passed ? "text-green-600" : "text-red-600"}`}>
              {results.passed ? "Passed!" : "Failed - Try Again"}
            </p>
          </div>

          <div className="space-y-4">
            {results.results.map((result: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-2">
                  {result.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{quiz.questions[index].question}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your answer: {quiz.questions[index].options[result.selectedOption].text}
                    </p>
                    {result.explanation && (
                      <p className="text-sm mt-2 text-blue-600">{result.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={() => window.location.reload()} className="w-full">
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  const question = quiz.questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{question.question}</h3>
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedAnswer === index
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={answers.length !== quiz.questions.length || loading}
            >
              {loading ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={selectedAnswer === undefined}>
              Next
            </Button>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          {quiz.questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                answers[index] !== undefined ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
