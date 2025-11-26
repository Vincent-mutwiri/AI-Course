import { useState } from 'react';
import { Check, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Choice {
  id?: string;
  label: string;
  description?: string;
}

interface ChoiceComparisonProps {
  data: {
    question?: string;
    choices?: Choice[];
    title?: string;
    config?: any;
  };
}

export const ChoiceComparisonComponent: React.FC<ChoiceComparisonProps> = ({ data }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isSubmitted = selectedId !== null;

  // Ensure data and choices exist with defaults
  const choices = data?.choices || [];
  const question = data?.question || 'Compare the following options';
  const title = data?.title || 'Choice Comparison';

  const handleSelect = (choiceIndex: number) => {
    setSelectedId(String(choiceIndex));
  };

  const selectedIndex = selectedId !== null ? parseInt(selectedId) : null;
  const selectedChoice = selectedIndex !== null ? choices[selectedIndex] : null;

  // If no choices provided, show a message
  if (choices.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>No choices configured</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This component needs to be configured with choices.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{question}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {choices.map((choice, index) => {
            const isSelected = selectedId === String(index);
            const showResult = isSubmitted;

            return (
              <button
                key={choice.id || index}
                onClick={() => handleSelect(index)}
                className={cn(
                  "p-5 border-2 rounded-lg text-left transition-all duration-300",
                  "hover:shadow-md",
                  !showResult && "border-muted hover:border-primary hover:bg-accent/50",
                  isSelected && !showResult && "border-primary bg-accent/50",
                  isSelected && showResult && "ring-2 ring-primary ring-offset-2 border-primary bg-primary/10"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-base">{choice.label}</h4>
                  {isSelected && showResult && (
                    <div className="flex-shrink-0 ml-2">
                      <div className="flex items-center gap-1 text-primary">
                        <Check className="w-5 h-5" />
                        <span className="text-xs font-semibold">Selected</span>
                      </div>
                    </div>
                  )}
                </div>
                {choice.description && (
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {choice.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {!isSubmitted && (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              👆 Click on a choice to select it
            </p>
          </div>
        )}

        {isSubmitted && selectedChoice && (
          <div className="p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 border-2 border-primary/30 rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="text-lg font-semibold">Your Selection</h4>
                <p className="text-foreground/90 leading-relaxed">
                  You selected: <strong>{selectedChoice.label}</strong>
                </p>
                <p className="text-sm text-muted-foreground mt-3 italic">
                  💡 Consider the pros and cons of each option and how they might apply to different situations.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
