import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Lightbulb, Users, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ReflectionComponentProps {
  question: string;
  prompt?: string;
  placeholder?: string;
  minLength?: number;
  courseId?: string;
  moduleId?: string;
}

interface Reflection {
  _id: string;
  userId: {
    name: string;
    avatar?: string;
  };
  answer: string;
  createdAt: string;
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
  const [communityReflections, setCommunityReflections] = useState<Reflection[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);

  // Load saved reflection from localStorage
  useEffect(() => {
    const savedKey = `reflection_${question.substring(0, 50)}`;
    const saved = localStorage.getItem(savedKey);
    if (saved) {
      const { answer: savedAnswer, submitted } = JSON.parse(saved);
      setAnswer(savedAnswer);
      setIsSubmitted(submitted);
      if (submitted) {
        fetchCommunityReflections();
      }
    }
  }, [question]);

  const fetchCommunityReflections = async () => {
    setIsLoadingCommunity(true);
    try {
      const { data } = await api.get('/reflections', {
        params: { question, limit: 5 }
      });
      setCommunityReflections(data);
    } catch (error) {
      console.error('Failed to fetch community reflections:', error);
    } finally {
      setIsLoadingCommunity(false);
    }
  };

  const handleSubmit = async () => {
    if (answer.trim().length < minLength) {
      toast.error(`Please write at least ${minLength} characters for a meaningful reflection.`);
      return;
    }

    setIsSaving(true);

    try {
      // Save to backend
      if (courseId && moduleId) {
        await api.post('/reflections', {
          courseId,
          moduleId,
          question,
          answer,
          isPublic: true
        });
      }

      // Save to localStorage (backup/offline)
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
      fetchCommunityReflections();
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
  const remainingChars = Math.max(0, minLength - characterCount);
  const progressPercentage = minLength > 0 ? Math.min(100, (characterCount / minLength) * 100) : 100;

  return (
    <div className="space-y-6">
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
                  className={`min-h-[150px] resize-y transition-colors ${answer.length > 0 && !isValid
                    ? 'border-amber-400 focus-visible:ring-amber-400'
                    : isValid
                      ? 'border-green-500 focus-visible:ring-green-500'
                      : ''
                    }`}
                  disabled={isSaving}
                  aria-describedby="character-count-info"
                />

                {/* Character count with progress indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span
                      id="character-count-info"
                      className={`font-medium transition-colors ${isValid
                        ? 'text-green-600 dark:text-green-500'
                        : characterCount > 0
                          ? 'text-amber-600 dark:text-amber-500'
                          : 'text-muted-foreground'
                        }`}
                    >
                      {characterCount} / {minLength} characters
                      {isValid && ' ✓'}
                    </span>
                    {!isValid && characterCount > 0 && (
                      <span className="text-sm text-amber-600 dark:text-amber-500">
                        {remainingChars} more character{remainingChars !== 1 ? 's' : ''} needed
                      </span>
                    )}
                  </div>

                  {/* Visual progress bar */}
                  {minLength > 0 && (
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${isValid
                          ? 'bg-green-500'
                          : characterCount > 0
                            ? 'bg-amber-400'
                            : 'bg-muted-foreground/20'
                          }`}
                        style={{ width: `${progressPercentage}%` }}
                        role="progressbar"
                        aria-valuenow={characterCount}
                        aria-valuemin={0}
                        aria-valuemax={minLength}
                        aria-label="Character count progress"
                      />
                    </div>
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

      {/* Community Reflections Section */}
      {isSubmitted && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Community Insights</CardTitle>
            </div>
            <CardDescription>
              See what other educators are thinking about this topic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingCommunity ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin text-2xl">⏳</div>
              </div>
            ) : communityReflections.length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {communityReflections.map((reflection) => (
                    <div key={reflection._id} className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={reflection.userId.avatar} />
                          <AvatarFallback>{reflection.userId.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{reflection.userId.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(reflection.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {reflection.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                <p>No other reflections yet. Be the first to start the conversation!</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
