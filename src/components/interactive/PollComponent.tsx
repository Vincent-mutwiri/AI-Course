import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, BarChart3 } from "lucide-react";

interface PollOption {
  id?: string;
  text: string;
  votes?: number;
}

interface PollComponentProps {
  pollData?: {
    question?: string;
    title?: string;
    options?: PollOption[];
    allowMultiple?: boolean;
    showResults?: boolean;
  };
  question?: string;
  title?: string;
  options?: PollOption[];
  allowMultiple?: boolean;
  showResults?: boolean;
}

export const PollComponent: React.FC<PollComponentProps> = (props) => {
  // Support both nested pollData and flat props for flexibility
  const pollData = props.pollData || props;

  const question = pollData?.question || "Poll Question";
  const title = pollData?.title;
  const options = pollData?.options || [];
  const allowMultiple = pollData?.allowMultiple || false;
  const showResults = pollData?.showResults !== false; // Default to true

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>({});

  // Generate unique poll ID for localStorage using question and first option
  const pollId = `poll_${question.substring(0, 30)}_${options[0]?.text?.substring(0, 20) || 'default'}`.replace(/\s+/g, '_');

  // Load saved response and votes from localStorage
  useEffect(() => {
    // Initialize votes first
    initializeVotes();

    const savedResponse = localStorage.getItem(pollId);
    if (savedResponse) {
      try {
        const { selectedIds: saved, isSubmitted: submitted } = JSON.parse(savedResponse);
        if (saved && saved.length > 0 && submitted) {
          setSelectedIds(saved);
          setIsSubmitted(true);

          // Load saved votes
          const savedVotes = localStorage.getItem(`${pollId}_votes`);
          if (savedVotes) {
            setVotes(JSON.parse(savedVotes));
          }
        }
      } catch (error) {
        console.error('Error loading saved poll response:', error);
      }
    }
  }, [pollId]);

  const initializeVotes = () => {
    const initialVotes: Record<string, number> = {};
    options.forEach((option, index) => {
      const optionId = option.id || `option-${index}`;
      initialVotes[optionId] = option.votes || 0;
    });
    setVotes(initialVotes);
  };

  const handleSelect = (optionId: string) => {
    if (isSubmitted) return;

    if (allowMultiple) {
      // Toggle selection for multiple choice
      setSelectedIds(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      // Single selection
      setSelectedIds([optionId]);
    }
  };

  const handleSubmit = () => {
    if (selectedIds.length === 0) return;

    setIsSubmitted(true);

    // Update vote counts
    const newVotes = { ...votes };
    selectedIds.forEach(id => {
      newVotes[id] = (newVotes[id] || 0) + 1;
    });
    setVotes(newVotes);

    // Save to localStorage
    localStorage.setItem(pollId, JSON.stringify({
      selectedIds,
      isSubmitted: true,
      timestamp: new Date().toISOString()
    }));

    localStorage.setItem(`${pollId}_votes`, JSON.stringify(newVotes));
  };

  const getTotalVotes = () => {
    return Object.values(votes).reduce((sum, count) => sum + count, 0);
  };

  const getPercentage = (optionId: string) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round(((votes[optionId] || 0) / total) * 100);
  };

  const isSelected = (optionId: string) => selectedIds.includes(optionId);

  // If no options provided, show a message
  if (options.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          {title && <CardTitle className="text-2xl mb-2">{title}</CardTitle>}
          <CardTitle className={title ? "text-lg" : "text-xl"}>{question}</CardTitle>
          <CardDescription>No options configured</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This poll needs to be configured with options.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        {title && <CardTitle className="text-2xl mb-2">{title}</CardTitle>}
        <CardTitle className={title ? "text-lg" : "text-xl"}>{question}</CardTitle>
        {!isSubmitted && (
          <CardDescription>
            {allowMultiple
              ? "Select one or more options, then click Submit"
              : "Select an option to vote"}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {options.map((option, index) => {
            const optionId = option.id || `option-${index}`;
            const selected = isSelected(optionId);
            const percentage = getPercentage(optionId);

            return (
              <div key={optionId} className="relative">
                <Button
                  variant={selected ? "default" : "outline"}
                  className={`w-full justify-start text-left h-auto py-4 px-6 transition-all ${selected
                    ? "ring-2 ring-primary ring-offset-2"
                    : "hover:bg-accent"
                    }`}
                  onClick={() => handleSelect(optionId)}
                  disabled={isSubmitted}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className={`w-5 h-5 ${allowMultiple ? 'rounded' : 'rounded-full'} border-2 flex items-center justify-center ${selected
                        ? "border-primary-foreground bg-primary-foreground"
                        : "border-muted-foreground"
                        }`}
                    >
                      {selected && (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <span className="flex-1">{option.text}</span>
                    {isSubmitted && showResults && (
                      <span className="font-semibold text-sm">{percentage}%</span>
                    )}
                  </div>
                </Button>

                {/* Results bar */}
                {isSubmitted && showResults && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b overflow-hidden">
                    <div
                      className="h-full bg-primary/60 transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit button for multiple choice */}
        {allowMultiple && !isSubmitted && (
          <Button
            onClick={handleSubmit}
            disabled={selectedIds.length === 0}
            className="w-full"
          >
            Submit {selectedIds.length > 0 && `(${selectedIds.length} selected)`}
          </Button>
        )}

        {/* Single choice auto-submits */}
        {!allowMultiple && selectedIds.length > 0 && !isSubmitted && (
          <Button
            onClick={handleSubmit}
            className="w-full"
          >
            Submit Vote
          </Button>
        )}

        {/* Results summary */}
        {isSubmitted && showResults && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <p className="font-semibold text-foreground">Results</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Total votes: {getTotalVotes()}
              </p>
              {selectedIds.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Your selection: {options.find((opt, idx) =>
                    (opt.id || `option-${idx}`) === selectedIds[0]
                  )?.text}
                  {selectedIds.length > 1 && ` and ${selectedIds.length - 1} more`}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
