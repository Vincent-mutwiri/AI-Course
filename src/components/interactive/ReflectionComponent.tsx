import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';

interface ReflectionComponentProps {
  question: string;
  prompt?: string;
  placeholder?: string;
  minLength?: number;
  courseId?: string;
  moduleId?: string;
}

export const ReflectionComponent: React.FC<ReflectionComponentProps> = ({
  question,
  prompt,
  placeholder = "Type your reflection here...",
  minLength = 50,
  courseId,
  moduleId,
}) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved reflection from localStorage
  useEffect(() => {
    const savedKey = `reflection_${question.substring(0, 50)}`;
    const saved = localStorage.getItem(savedKey);
    if (saved) {
      const { answer: savedAnswer, submitted } = JSON.parse(saved);
      setAnswer(savedAnswer);
      setIsSubmitted(submitted);
    }
  }, [question]);

  const handleSubmit = async () => {
    if (answer.trim().length < minLength) {
      toast.error(`Please write at least ${minLength} characters for a meaningful reflection.`);
      return;
    }

    setIsSaving(true);

    try {
      // Save to localStorage
      const savedKey = `reflection_${question.substring(0, 50)}`;
      localStorage.setItem(savedKey, JSON.stringify({
        answer: answer,
        submitted: true,
        timestamp: new Date().toISOString()
      }));

      // Track analytics
      try {
        await api.post('/analytics/track', {
          eventType: 'reflection_submitted',
          courseId: courseId || 'learning_science_playbook',
          moduleId: moduleId || 'unknown',
          question: question,
          answerLength: answer.length,
          timestamp: new Date().toISOString()
        });
      } catch (analyticsError) {
        console.warn('Analytics tracking failed:', analyticsError);
      }

      setIsSubmitted(true);
      toast.success('Your reflection has been saved!');
    } catch (error) {
      console.error('Error saving reflection:', error);
      toast.error('Failed to save reflection. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  const characterCount = answer.length;
  const isValid = characterCount >= minLength;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start gap-3">
          <Lightbulb className="h-6 w-6 text-amber-500 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <CardTitle className="text-xl">{question}</CardTitle>
            {prompt && (
              <CardDescription className="mt-2">{prompt}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSubmitted ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="reflection-answer">Your Reflection</Label>
              <Textarea
                id="reflection-answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={placeholder}
                className="min-h-[150px] resize-y"
                disabled={isSaving}
              />
              <div className="flex items-center justify-between text-sm">
                <span className={`${isValid ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {characterCount} / {minLength} characters {isValid && '✓'}
                </span>
                {!isValid && (
                  <span className="text-muted-foreground">
                    {minLength - characterCount} more needed
                  </span>
                )}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!isValid || isSaving}
              className="w-full"
            >
              {isSaving ? 'Saving...' : 'Submit Reflection'}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border-2 border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <p className="font-semibold text-green-900 dark:text-green-100">
                  Reflection Saved!
                </p>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                Your insights have been recorded. Scroll down to see what other educators shared!
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Your Reflection:</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{answer}</p>
            </div>

            <Button
              variant="outline"
              onClick={handleEdit}
              className="w-full"
            >
              Edit Reflection
            </Button>
          </div>
        )}

        {/* Helpful Tip */}
        {!isSubmitted && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-900 dark:text-blue-100">
              <strong>💡 Tip:</strong> Be specific! Instead of "it was fun," try "students were 
              engaged because they could choose their own project topics."
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
