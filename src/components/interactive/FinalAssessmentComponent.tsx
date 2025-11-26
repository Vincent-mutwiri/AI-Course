import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { learningScienceQuiz } from '@/data/simulations/quizData';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import api from '@/services/api';

const ASSESSMENT_KEY = 'assessmentPassStatus_LS';
const ASSESSMENT_SCORE_KEY = 'assessmentScore_LS';

interface QuestionOption {
  text: string;
  feedback?: string;
}

interface Question {
  id?: string;
  question?: string;
  text?: string;
  type?: 'multiple-choice' | 'short-answer' | 'essay';
  options?: (string | QuestionOption)[];
  answer?: string;
  correctAnswer?: string;
  explanation?: string;
}

interface FinalAssessmentComponentProps {
  data: {
    title?: string;
    description?: string;
    passingScore?: number;
    totalQuestions?: number;
    quizDataKey?: string;
    questions?: Question[];
    config?: any;
  };
}

export const FinalAssessmentComponent: React.FC<FinalAssessmentComponentProps> = ({ data }) => {
  const { user } = useAuth();

  console.log('FinalAssessmentComponent received data:', data);
  console.log('Questions from data:', data.questions);

  const passingScore = data.passingScore || 70;

  // Normalize questions to handle both old and new formats
  const normalizeQuestions = (questions: Question[]) => {
    return questions.map((q, index) => ({
      id: q.id || `q-${index}`,
      text: q.question || q.text || '',
      type: q.type || 'multiple-choice',
      options: q.options || [],
      optionsArray: (q.options || []).map(opt => typeof opt === 'string' ? opt : (opt as QuestionOption).text),
      answer: q.correctAnswer || q.answer || '',
      explanation: q.explanation || ''
    }));
  };

  // Use provided questions or fall back to default quiz
  const rawQuestions = data.questions && data.questions.length > 0
    ? data.questions
    : learningScienceQuiz.questions;

  console.log('Using questions:', rawQuestions);
  console.log('Is using fallback quiz?', !data.questions || data.questions.length === 0);

  const questions = normalizeQuestions(rawQuestions);

  // Check localStorage for previous pass
  const [passStatus, setPassStatus] = useState<boolean | null>(() => {
    const storedPass = localStorage.getItem(ASSESSMENT_KEY);
    return storedPass ? JSON.parse(storedPass) : null;
  });

  const [score, setScore] = useState<number | null>(() => {
    const storedScore = localStorage.getItem(ASSESSMENT_SCORE_KEY);
    return storedScore ? parseInt(storedScore) : null;
  });

  const [isSubmitted, setIsSubmitted] = useState(passStatus !== null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    // Calculate score
    let newScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.answer) {
        newScore++;
      }
    });

    setScore(newScore);

    // Calculate percentage
    const percentage = (newScore / questions.length) * 100;
    const didPass = percentage >= passingScore;

    setPassStatus(didPass);
    setIsSubmitted(true);
    setShowResults(true);

    // Save to localStorage
    localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(didPass));
    localStorage.setItem(ASSESSMENT_SCORE_KEY, newScore.toString());

    // Track with analytics
    try {
      await api.post('/analytics/track', {
        eventType: didPass ? 'certificate_earned' : 'assessment_failed',
        courseId: 'learning_science_playbook',
        score: newScore,
        totalQuestions: questions.length,
        passed: didPass
      });

      if (didPass) {
        toast.success('Congratulations! You passed the assessment!');
      } else {
        toast.error(`You scored ${newScore}/${questions.length}. You need ${passingScore} to pass.`);
      }
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setIsSubmitted(false);
    setShowResults(false);
    setScore(null);
    setPassStatus(null);
    localStorage.removeItem(ASSESSMENT_KEY);
    localStorage.removeItem(ASSESSMENT_SCORE_KEY);
    toast.info('Assessment reset. Good luck!');
  };

  const allAnswered = questions.every(q => answers[q.id]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{data.title || "Final Knowledge Check"}</CardTitle>
            <CardDescription>
              {data.description || `Answer all ${questions.length} questions. You need ${passingScore}% to pass and earn your certificate.`}
            </CardDescription>
          </div>
          {isSubmitted && (
            <Button variant="outline" size="sm" onClick={handleRetake}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retake
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isSubmitted ? (
          <>
            {/* Quiz Questions */}
            <div className="space-y-8">
              {questions.map((question, index) => (
                <div key={question.id} className="p-6 border-2 rounded-lg bg-muted/30">
                  <h4 className="text-lg font-semibold mb-4">
                    {index + 1}. {question.text}
                  </h4>
                  <RadioGroup
                    value={answers[question.id] || ''}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                  >
                    {question.optionsArray.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-2 p-3 rounded-md hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value={option} id={`${question.id}-${optIndex}`} />
                        <Label htmlFor={`${question.id}-${optIndex}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="w-full md:w-auto"
              >
                {allAnswered ? 'Submit My Answers' : `Answer All Questions (${Object.keys(answers).length}/${questions.length})`}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Results */}
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={`p-8 rounded-lg border-2 ${passStatus
                ? 'bg-green-50 dark:bg-green-950/20 border-green-500'
                : 'bg-red-50 dark:bg-red-950/20 border-red-500'
                }`}>
                <div className="flex justify-center mb-4">
                  {passStatus ? (
                    <CheckCircle className="h-16 w-16 text-green-600" />
                  ) : (
                    <XCircle className="h-16 w-16 text-red-600" />
                  )}
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  Your Score: {score} / {questions.length} ({Math.round((score! / questions.length) * 100)}%)
                </h3>
                <p className={`text-xl ${passStatus ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                  {passStatus
                    ? '🎉 Congratulations, you passed!'
                    : `You need ${passingScore}% to pass.`}
                </p>
              </div>

              {!passStatus && (
                <div className="p-6 bg-muted/50 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3">Try Again</h4>
                  <p className="text-muted-foreground mb-4">
                    Review the course materials and retake the assessment. You've got this!
                  </p>
                  <Button onClick={handleRetake} variant="default">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retake Assessment
                  </Button>
                </div>
              )}

              {/* Show detailed results if they want */}
              {showResults && (
                <Button
                  variant="outline"
                  onClick={() => setShowResults(!showResults)}
                  className="mt-4"
                >
                  Review Answers
                </Button>
              )}
            </div>

            {/* Detailed Results (optional) */}
            {showResults && (
              <div className="mt-6 space-y-4">
                <h4 className="text-lg font-semibold">Answer Review:</h4>
                {questions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer === question.answer;

                  // Find the feedback for the user's selected answer
                  const selectedOption = question.options.find(opt =>
                    (typeof opt === 'string' ? opt : (opt as QuestionOption).text) === userAnswer
                  );
                  const userFeedback = selectedOption && typeof selectedOption === 'object'
                    ? (selectedOption as QuestionOption).feedback
                    : '';

                  // Find the feedback for the correct answer
                  const correctOption = question.options.find(opt =>
                    (typeof opt === 'string' ? opt : (opt as QuestionOption).text) === question.answer
                  );
                  const correctFeedback = correctOption && typeof correctOption === 'object'
                    ? (correctOption as QuestionOption).feedback
                    : '';

                  return (
                    <div
                      key={question.id}
                      className={`p-4 rounded-lg border-2 ${isCorrect
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-500'
                        : 'bg-red-50 dark:bg-red-950/20 border-red-500'
                        }`}
                    >
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1 space-y-2">
                          <p className="font-medium">
                            {index + 1}. {question.text}
                          </p>
                          <div className="text-sm space-y-1">
                            <p>
                              <strong>Your answer:</strong> {userAnswer || 'Not answered'}
                            </p>
                            {userFeedback && (
                              <p className={`italic ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                                💡 {userFeedback}
                              </p>
                            )}
                          </div>
                          {!isCorrect && (
                            <div className="text-sm space-y-1 pt-2 border-t">
                              <p className="text-green-700 dark:text-green-300">
                                <strong>Correct answer:</strong> {question.answer}
                              </p>
                              {correctFeedback && (
                                <p className="italic text-green-700 dark:text-green-300">
                                  💡 {correctFeedback}
                                </p>
                              )}
                            </div>
                          )}
                          {question.explanation && (
                            <div className="text-sm pt-2 border-t">
                              <p className="text-muted-foreground">
                                <strong>Explanation:</strong> {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
