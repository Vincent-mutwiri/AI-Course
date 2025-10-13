import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import api from '@/services/api';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface QuizData {
  title: string;
  questions: Question[];
}

const AIQuiz = ({ topic }: { topic: string }) => {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const { data } = await api.post('/ai/quiz/generate', { topic });
        setQuiz(data);
      } catch (error) {
        console.error('Failed to generate quiz:', error);
      } finally {
        setLoading(false);
      }
    };
    getQuiz();
  }, [topic]);

  const handleAnswer = async () => {
    if (!quiz || selectedAnswer === null) return;

    const question = quiz.questions[currentQuestionIndex];
    const { data } = await api.post('/ai/quiz/feedback', {
      question: question.text,
      userAnswer: selectedAnswer,
      correctAnswer: question.correctAnswer
    });
    setFeedback(data.feedback);

    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setSelectedAnswer(null);
    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) return <div>Generating quiz...</div>;
  if (!quiz) return <div>Failed to generate quiz</div>;
  if (quizFinished) return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-4">Quiz Finished!</h3>
      <p className="text-xl">Your score: {score} / {quiz.questions.length}</p>
    </div>
  );

  const question = quiz.questions[currentQuestionIndex];

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">{question.text}</h3>
      <div className="flex flex-col space-y-2 mt-4">
        {question.options.map(option => (
          <Button
            key={option}
            variant={selectedAnswer === option ? "default" : "outline"}
            onClick={() => setSelectedAnswer(option)}
            disabled={feedback !== null}
          >
            {option}
          </Button>
        ))}
      </div>
      {feedback ? (
        <div className="mt-4">
          <div className="p-4 bg-muted rounded-md mb-2">{feedback}</div>
          <Button onClick={handleNext}>Next</Button>
        </div>
      ) : (
        <Button onClick={handleAnswer} className="mt-4" disabled={selectedAnswer === null}>
          Submit
        </Button>
      )}
    </div>
  );
};

export default AIQuiz;
