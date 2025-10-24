import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface PollOption {
  id: string;
  text: string;
}

interface SimulatedResult {
  percentage: number;
  feedback: string;
}

interface PollComponentProps {
  pollData: {
    question: string;
    options: PollOption[];
    simulatedResult: SimulatedResult;
  };
}

export const PollComponent: React.FC<PollComponentProps> = ({ pollData }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedId(optionId);
    setIsSubmitted(true);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">{pollData.question}</CardTitle>
        {!isSubmitted && (
          <CardDescription>Select an option to see how others responded</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {pollData.options.map((option) => (
            <Button
              key={option.id}
              variant={selectedId === option.id ? "default" : "outline"}
              className={`w-full justify-start text-left h-auto py-4 px-6 transition-all ${
                selectedId === option.id
                  ? "ring-2 ring-primary ring-offset-2"
                  : "hover:bg-accent"
              }`}
              onClick={() => handleSelect(option.id)}
              disabled={isSubmitted}
            >
              <div className="flex items-center gap-3 w-full">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedId === option.id
                      ? "border-primary-foreground bg-primary-foreground"
                      : "border-muted-foreground"
                  }`}
                >
                  {selectedId === option.id && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </div>
                <span className="flex-1">{option.text}</span>
              </div>
            </Button>
          ))}
        </div>

        {isSubmitted && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-lg font-medium text-foreground">
                {pollData.simulatedResult.feedback}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Community Response</span>
                <span className="font-bold text-primary">
                  {pollData.simulatedResult.percentage}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${pollData.simulatedResult.percentage}%`,
                    animation: "slideIn 1s ease-out",
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                {pollData.simulatedResult.percentage}% of educators share your experience
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
