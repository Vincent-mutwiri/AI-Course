import { useState } from 'react';
import { Check, X, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Option {
  id: string;
  title: string;
  text: string;
  isCorrect: boolean;
}

interface ChoiceComparisonProps {
  data: {
    prompt: string;
    options: Option[];
    explanation: string;
  };
}

export const ChoiceComparisonComponent: React.FC<ChoiceComparisonProps> = ({ data }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isSubmitted = selectedId !== null;

  // Ensure data and options exist with defaults
  const options = data?.options || [];
  const prompt = data?.prompt || 'Compare the following options';
  const explanation = data?.explanation || '';

  const handleSelect = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedId(optionId);

    // Optional: Track this interaction
    // api.analytics.trackEvent('choice_comparison_made', { optionId });
  };

  const selectedOption = options.find(opt => opt.id === selectedId);

  // If no options provided, show a message
  if (options.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Feedback Face-off</CardTitle>
          <CardDescription>No options configured</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This component needs to be configured with options.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Feedback Face-off</CardTitle>
        <CardDescription>{prompt}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            const isCorrect = opt.isCorrect;
            const showResult = isSubmitted;

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={isSubmitted}
                className={cn(
                  "p-5 border-2 rounded-lg text-left transition-all duration-300",
                  "hover:shadow-md",
                  !showResult && "border-muted hover:border-primary hover:bg-accent/50",
                  showResult && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                  showResult && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                  isSelected && showResult && isCorrect && "ring-2 ring-green-500 ring-offset-2",
                  isSelected && showResult && !isCorrect && "ring-2 ring-red-500 ring-offset-2"
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-base">{opt.title}</h4>
                  {showResult && (
                    <div className="flex-shrink-0 ml-2">
                      {isCorrect ? (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <Check className="w-5 h-5" />
                          <span className="text-xs font-semibold">GPS Feedback</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                          <X className="w-5 h-5" />
                          <span className="text-xs font-semibold">Stop Sign</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {opt.text}
                </p>
              </button>
            );
          })}
        </div>

        {!isSubmitted && (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              👆 Click on the feedback example you think is more effective
            </p>
          </div>
        )}

        {isSubmitted && (
          <div className="p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 border-2 border-primary/30 rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="text-lg font-semibold">The Takeaway</h4>
                <p className="text-foreground/90 leading-relaxed">{explanation}</p>
                {selectedOption && !selectedOption.isCorrect && (
                  <p className="text-sm text-muted-foreground mt-3 italic">
                    💡 Tip: Look for feedback that is specific, actionable, and provides a clear next step.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
