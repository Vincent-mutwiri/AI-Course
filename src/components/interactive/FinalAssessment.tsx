import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const questions = [
  {
    question: "What are tokens in AI?",
    options: ["Security credentials", "Small pieces of text AI processes", "AI models", "Programming commands"],
    correct: 1
  },
  {
    question: "How does AI generate text?",
    options: ["By copying from databases", "By predicting likely next words", "By following strict rules", "By random selection"],
    correct: 1
  },
  {
    question: "What determines an AI's personality?",
    options: ["The computer it runs on", "System prompts that guide its behavior", "The user's personality", "Random chance"],
    correct: 1
  },
  {
    question: "What is the main benefit of AI Study Buddy?",
    options: ["Replaces teachers", "Summarizes complex topics", "Does homework for you", "Grades assignments"],
    correct: 1
  },
  {
    question: "Which personality trait is best for developing critical thinking?",
    options: ["Concise", "Formal", "Socratic", "Encouraging"],
    correct: 2
  },
  {
    question: "What does the Presentation Coach analyze?",
    options: ["Only grammar", "Word count, filler words, and pacing", "Just spelling", "Only tone"],
    correct: 1
  },
  {
    question: "What should teachers consider when using AI tools?",
    options: ["Only cost", "Student privacy and ethics", "Speed only", "Popularity"],
    correct: 1
  },
  {
    question: "What can the Lesson Plan Generator help with?",
    options: ["Only grading", "Creating comprehensive lesson plans", "Taking attendance", "Disciplining students"],
    correct: 1
  },
  {
    question: "What is the purpose of a rubric?",
    options: ["To confuse students", "To provide clear assessment criteria", "To make grading harder", "To replace feedback"],
    correct: 1
  },
  {
    question: "What is the purpose of an AI usage policy?",
    options: ["To ban AI completely", "To establish guidelines and responsibilities", "To promote one AI tool", "To replace human judgment"],
    correct: 1
  },
  {
    question: "What can the Data Dashboard help identify?",
    options: ["Only attendance", "Trends and struggling students", "Just grades", "Only behavior issues"],
    correct: 1
  },
  {
    question: "What is a key ethical consideration when using AI in education?",
    options: ["Using AI for everything", "Balancing AI assistance with academic integrity", "Hiding AI usage", "Replacing all teachers"],
    correct: 1
  }
];

interface FinalAssessmentProps {
  onPass: () => void;
}

export const FinalAssessment = ({ onPass }: FinalAssessmentProps) => {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    const correctCount = answers.filter((ans, idx) => ans === questions[idx].correct).length;
    setScore(correctCount);
    setSubmitted(true);
    
    if (correctCount >= 10) {
      onPass();
    }
  };

  const handleAnswer = (questionIdx: number, answerIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIdx] = answerIdx;
    setAnswers(newAnswers);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Final Assessment</CardTitle>
        <p className="text-sm text-muted-foreground">
          Answer at least 10 out of 12 questions correctly to unlock your certificate
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="space-y-3">
            <h4 className="font-medium">{qIdx + 1}. {q.question}</h4>
            <RadioGroup
              value={answers[qIdx]?.toString()}
              onValueChange={(val) => handleAnswer(qIdx, parseInt(val))}
              disabled={submitted}
            >
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center space-x-2">
                  <RadioGroupItem value={oIdx.toString()} id={`q${qIdx}-o${oIdx}`} />
                  <Label htmlFor={`q${qIdx}-o${oIdx}`} className={
                    submitted && oIdx === q.correct ? 'text-green-600 font-medium' :
                    submitted && oIdx === answers[qIdx] && oIdx !== q.correct ? 'text-red-600' : ''
                  }>
                    {opt}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        {!submitted ? (
          <Button 
            onClick={handleSubmit} 
            disabled={answers.includes(-1)}
            className="w-full"
          >
            Submit Assessment
          </Button>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-lg font-medium">
              Score: {score} / {questions.length}
            </p>
            {score >= 10 ? (
              <p className="text-green-600 font-medium">
                Congratulations! You passed. Your certificate is now available.
              </p>
            ) : (
              <p className="text-red-600">
                You need at least 10 correct answers. Please review the course and try again.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
