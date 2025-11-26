import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, BarChart3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "react-router-dom";
import api from "@/services/api";
import { toast } from "sonner";

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
  pollId?: string; // Unique identifier for this poll block
  courseId?: string; // Course ID passed from parent
}

export const PollComponent: React.FC<PollComponentProps> = (props) => {
  // Support both nested pollData and flat props for flexibility
  const pollData = props.pollData || props;
  const { user } = useAuth();
  const paramsFromUrl = useParams<{ courseId: string }>();
  // Use courseId from props first, then fall back to URL params
  const courseId = props.courseId || paramsFromUrl.courseId;

  const question = pollData?.question || "Poll Question";
  const title = pollData?.title;
  const options = pollData?.options || [];
  const allowMultiple = pollData?.allowMultiple || false;
  const showResults = pollData?.showResults !== false; // Default to true

  // Generate a stable pollId based on question content if not provided
  // Use useMemo to ensure it doesn't change between renders
  const pollId = useMemo(() => {
    if (props.pollId) return props.pollId;

    // Create a simple hash from question and first option
    const hashString = `${question}_${options[0]?.text || options[0]?.id || ''}`;

    // Simple hash function to create a shorter, stable ID
    let hash = 0;
    for (let i = 0; i < hashString.length; i++) {
      const char = hashString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    return `poll_${Math.abs(hash)}`;
  }, [props.pollId, question, options]);

  console.log('PollComponent props:', { pollId: props.pollId, generatedPollId: pollId, courseId: props.courseId, question });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Load user's previous response and poll results from database
  useEffect(() => {
    const loadPollData = async () => {
      console.log('Loading poll data:', { user: !!user, courseId, pollId });

      if (!user || !courseId || !pollId) {
        console.warn('Missing required data for poll:', { user: !!user, courseId, pollId });
        setLoading(false);
        return;
      }

      try {
        // Load user's response
        console.log('Fetching user response:', `/polls/response/${courseId}/${pollId}`);
        const responseRes = await api.get(`/polls/response/${courseId}/${pollId}`);
        console.log('User response:', responseRes.data);

        if (responseRes.data.hasResponded) {
          setSelectedIds(responseRes.data.selectedOptions);
          setIsSubmitted(true);
        }

        // Load poll results
        console.log('Fetching poll results:', `/polls/results/${courseId}/${pollId}`);
        const resultsRes = await api.get(`/polls/results/${courseId}/${pollId}`);
        console.log('Poll results:', resultsRes.data);
        setVotes(resultsRes.data.voteCounts || {});
      } catch (error: any) {
        console.error('Error loading poll data:', error);
        console.error('Error response:', error.response?.data);
        // Initialize empty votes if error
        const initialVotes: Record<string, number> = {};
        options.forEach((option, index) => {
          const optionId = option.id || `option-${index}`;
          initialVotes[optionId] = 0;
        });
        setVotes(initialVotes);
      } finally {
        setLoading(false);
      }
    };

    loadPollData();
  }, [user, courseId, pollId, options]);

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

  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one option');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to vote');
      return;
    }

    if (!courseId) {
      toast.error('Course ID not found');
      return;
    }

    console.log('Submitting poll:', { courseId, pollId, selectedOptions: selectedIds });

    try {
      // Submit to database
      const response = await api.post('/polls/submit', {
        courseId,
        pollId,
        selectedOptions: selectedIds,
      });

      console.log('Poll submitted successfully:', response.data);
      setIsSubmitted(true);

      // Reload results to get updated vote counts
      const resultsRes = await api.get(`/polls/results/${courseId}/${pollId}`);
      console.log('Results after submission:', resultsRes.data);
      console.log('Vote counts:', resultsRes.data.voteCounts);
      setVotes(resultsRes.data.voteCounts || {});
      console.log('Votes state updated:', resultsRes.data.voteCounts);

      toast.success('Your vote has been recorded!');
    } catch (error: any) {
      console.error('Error submitting poll:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to submit your vote. Please try again.');
    }
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

  // Show loading state
  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          {title && <CardTitle className="text-2xl mb-2">{title}</CardTitle>}
          <CardTitle className={title ? "text-lg" : "text-xl"}>{question}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading poll...</p>
        </CardContent>
      </Card>
    );
  }

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
