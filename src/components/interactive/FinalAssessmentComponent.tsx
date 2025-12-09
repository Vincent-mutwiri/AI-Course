import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  maxScore?: number;
  rubric?: string;
}

interface AIGradingResult {
  score: number;
  maxScore: number;
  feedback: string;
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



  // Normalize questions to handle both old and new formats
  const normalizeQuestions = (questions: Question[]) => {
    return questions.map((q, index) => ({
      id: q.id || `q-${index}`,
      text: q.question || q.text || '',
      type: q.type || 'multiple-choice',
      options: q.options || [],
      optionsArray: (q.options || []).map(opt => typeof opt === 'string' ? opt : (opt as QuestionOption).text),
      answer: q.correctAnswer || q.answer || '',
      explanation: q.explanation || '',
      maxScore: q.maxScore
    }));
  };

  // Use provided questions or fall back to default quiz
  const rawQuestions = data.questions && data.questions.length > 0
    ? data.questions
    : learningScienceQuiz.questions;



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

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [aiGradingResults, setAiGradingResults] = useState<Record<string, AIGradingResult>>({});
  const [gradingInProgress, setGradingInProgress] = useState(false);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const gradeWithAI = async (question: any, studentAnswer: string): Promise<AIGradingResult> => {
    try {
      const response = await api.post('/ai/chat', {
        message: `You are an expert grader. Grade the following student response using the provided rubric.

Question: ${question.text}

Student Answer:
${studentAnswer}

Grading Rubric:
${question.rubric || 'Grade based on accuracy, completeness, and clarity.'}

${question.answer ? `Sample Answer for Reference:\n${question.answer}` : ''}

Maximum Score: ${question.maxScore || 10} points

Provide your response in the following JSON format:
{
  "score": <number between 0 and ${question.maxScore || 10}>,
  "feedback": "<detailed feedback explaining the score, what was done well, and what could be improved>"
}`
      });

      let responseText = response.data.response;
      // Strip markdown code blocks if present
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const result = JSON.parse(responseText);
      return {
        score: result.score,
        maxScore: question.maxScore || 10,
        feedback: result.feedback
      };
    } catch (error) {
      console.error('AI grading failed:', error);
      return {
        score: 0,
        maxScore: question.maxScore || 10,
        feedback: 'Unable to grade automatically. Please review with instructor.'
      };
    }
  };

  const handleSubmit = async () => {
    setGradingInProgress(true);
    toast.info('Grading your assessment...');

    try {
      // Calculate score for multiple choice and grade AI questions
      let newScore = 0;
      let totalPoints = 0;
      let earnedPoints = 0;
      const gradingResults: Record<string, AIGradingResult> = {};

      for (const q of questions) {
        const rawQuestion = rawQuestions.find((rq, idx) => (rq.id || `q-${idx}`) === q.id);

        if (q.type === 'multiple-choice' || !q.type) {
          // Multiple choice - simple correct/incorrect
          totalPoints += 1;
          if (answers[q.id] === q.answer) {
            newScore++;
            earnedPoints += 1;
          }
        } else if (q.type === 'short-answer' || q.type === 'essay') {
          // AI grading for text responses
          const studentAnswer = answers[q.id];
          if (studentAnswer) {
            const questionWithRubric = {
              ...q,
              rubric: (rawQuestion as any)?.rubric,
              maxScore: (rawQuestion as any)?.maxScore || 10
            };
            const result = await gradeWithAI(questionWithRubric, studentAnswer);
            gradingResults[q.id] = result;
            earnedPoints += result.score;
            totalPoints += result.maxScore;
          } else {
            // No answer
            totalPoints += (rawQuestion as any)?.maxScore || 10;
          }
        }
      }

      setAiGradingResults(gradingResults);
      setScore(newScore);

      // Everyone passes - no minimum score required
      const didPass = true;

      setPassStatus(didPass);
      setIsSubmitted(true);
      setShowResults(true);

      // Save to localStorage
      localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(didPass));
      localStorage.setItem(ASSESSMENT_SCORE_KEY, newScore.toString());

      // Track with analytics
      try {
        await api.post('/analytics/track', {
          eventType: 'assessment_completed',
          courseId: data.title || 'assessment',
          score: earnedPoints,
          totalPoints: totalPoints,
          passed: didPass
        });

        toast.success('Congratulations! You completed the assessment!');

      } catch (error) {
        console.error('Analytics tracking failed:', error);
      }
    } finally {
      setGradingInProgress(false);
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
              {data.description || `Answer all ${questions.length} questions.`}
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
                    {question.maxScore && (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({question.maxScore} points)
                      </span>
                    )}
                  </h4>

                  {/* Multiple Choice */}
                  {(question.type === 'multiple-choice' || !question.type) && (
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
                  )}

                  {/* Short Answer */}
                  {question.type === 'short-answer' && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Type your answer here..."
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        rows={4}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Your answer will be graded by AI using the instructor's rubric
                      </p>
                    </div>
                  )}

                  {/* Essay */}
                  {question.type === 'essay' && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Write your essay response here..."
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        rows={8}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Your essay will be graded by AI using the instructor's rubric
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!allAnswered || gradingInProgress}
                className="w-full md:w-auto"
              >
                {gradingInProgress ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Grading...
                  </>
                ) : allAnswered ? (
                  'Submit My Answers'
                ) : (
                  `Answer All Questions (${Object.keys(answers).length}/${questions.length})`
                )}
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
                <h3 className="text-3xl font-bold">
                  Assessment Complete!
                </h3>
              </div>

              {/* Show detailed results button */}
              <Button
                variant="outline"
                onClick={() => setShowResults(!showResults)}
                className="mt-4"
              >
                {showResults ? 'Hide Answers' : 'Review Answers'}
              </Button>
            </div>

            {/* Detailed Results (optional) */}
            {showResults && (
              <div className="mt-6 space-y-4">
                <h4 className="text-lg font-semibold">Answer Review:</h4>
                {questions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const aiResult = aiGradingResults[question.id];
                  const isAIGraded = question.type === 'short-answer' || question.type === 'essay';
                  const isCorrect = !isAIGraded && userAnswer === question.answer;

                  // For multiple choice - find feedback
                  const selectedOption = question.options?.find(opt =>
                    (typeof opt === 'string' ? opt : (opt as QuestionOption).text) === userAnswer
                  );
                  const userFeedback = selectedOption && typeof selectedOption === 'object'
                    ? (selectedOption as QuestionOption).feedback
                    : '';

                  const correctOption = question.options?.find(opt =>
                    (typeof opt === 'string' ? opt : (opt as QuestionOption).text) === question.answer
                  );
                  const correctFeedback = correctOption && typeof correctOption === 'object'
                    ? (correctOption as QuestionOption).feedback
                    : '';

                  return (
                    <div
                      key={question.id}
                      className={`p-4 rounded-lg border-2 ${isAIGraded
                        ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-500'
                        : isCorrect
                          ? 'bg-green-50 dark:bg-green-950/20 border-green-500'
                          : 'bg-red-50 dark:bg-red-950/20 border-red-500'
                        }`}
                    >
                      <div className="flex items-start gap-2">
                        {isAIGraded ? (
                          <div className="h-5 w-5 mt-1 flex-shrink-0 text-blue-600 font-bold">AI</div>
                        ) : isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1 space-y-2">
                          <p className="font-medium">
                            {index + 1}. {question.text}
                          </p>

                          {/* AI Graded Questions */}
                          {isAIGraded && aiResult && (
                            <div className="space-y-2">
                              <div className="text-sm bg-white dark:bg-gray-800 p-3 rounded border">
                                <strong>Your Answer:</strong>
                                <p className="mt-1 whitespace-pre-wrap">{userAnswer}</p>
                              </div>
                              <div className="text-sm">
                                <p className="font-semibold text-blue-700 dark:text-blue-300">
                                  Score: {aiResult.score}/{aiResult.maxScore} points
                                </p>
                              </div>
                              <div className="text-sm bg-blue-100 dark:bg-blue-900/30 p-3 rounded">
                                <strong className="text-blue-900 dark:text-blue-100">AI Feedback:</strong>
                                <p className="mt-1 text-blue-800 dark:text-blue-200">{aiResult.feedback}</p>
                              </div>
                            </div>
                          )}

                          {/* Multiple Choice Questions */}
                          {!isAIGraded && (
                            <>
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
                            </>
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
