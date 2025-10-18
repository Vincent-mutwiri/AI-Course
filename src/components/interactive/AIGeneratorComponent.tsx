import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { aiCache } from '@/utils/aiCache';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Lightbulb } from 'lucide-react';
import api from '@/services/api';

const EXAMPLE_PROMPTS: Record<string, string[]> = {
  studyBuddy: [
    'Explain photosynthesis in simple terms',
    'Summarize the causes of World War I',
    'What are the key concepts in calculus?'
  ],
  writingPartner: [
    'Review my essay introduction about climate change',
    'Suggest improvements for this story opening',
    'Help me make this paragraph more engaging'
  ],
  codeDebugger: [
    'Why is my Python loop not working?',
    'Find the error in this JavaScript function',
    'Debug this SQL query'
  ],
  lessonPlanner: [
    'Create a 45-min lesson on fractions for 5th grade',
    'Plan a science lab about chemical reactions',
    'Design an English lesson on persuasive writing'
  ],
  rubricBuilder: [
    'Create a rubric for a research paper (10 pages)',
    'Build a grading rubric for a group presentation',
    'Design assessment criteria for a coding project'
  ],
  policyDrafter: [
    'Draft an AI usage policy for high school students',
    'Create guidelines for AI in homework assignments',
    'Write a policy on AI-assisted learning'
  ]
};

interface AIGeneratorProps {
  generatorType: string;
  title: string;
  description?: string;
  placeholder?: string;
  options?: Record<string, any>;
}

const MAX_CHARS = 5000;

export const AIGeneratorComponent = ({ 
  generatorType, 
  title, 
  description,
  placeholder = "Enter your text here...",
  options = {}
}: AIGeneratorProps) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please enter some text first.');
      return;
    }
    if (input.length > MAX_CHARS) {
      toast.error(`Text is too long. Maximum ${MAX_CHARS} characters allowed.`);
      return;
    }

    const cacheKey = aiCache.generateKey(generatorType, input, options);
    const cached = aiCache.get(cacheKey);
    
    if (cached) {
      setResponse(cached);
      toast.success('Response loaded from cache');
      return;
    }

    setLoading(true);
    setResponse('');
    try {
      const { data } = await api.post('/ai/generate', {
        generatorType,
        userInput: input,
        options
      });
      setResponse(data.response);
      aiCache.set(cacheKey, data.response);
      
      // Track AI usage
      api.post('/analytics/track', {
        courseId: 'ai-course',
        eventType: 'ai_request',
        metadata: { generatorType, inputLength: input.length }
      }).catch(err => console.error('Analytics tracking failed:', err));
    } catch (error: any) {
      const errorMsg = error.response?.status === 401 
        ? 'Please log in to use this feature.'
        : error.response?.status === 503
        ? 'AI service is temporarily unavailable. Please try again later.'
        : 'Failed to generate response. Please check your connection and try again.';
      setResponse(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Enter your text and click Generate to get AI-powered assistance. Responses are cached for faster access.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        {EXAMPLE_PROMPTS[generatorType] && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Example prompts:</span>
            </div>
            <div className="space-y-1">
              {EXAMPLE_PROMPTS[generatorType].map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(example)}
                  className="block text-xs text-left text-muted-foreground hover:text-foreground transition-colors"
                >
                  • {example}
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <Label htmlFor="input">Your Input</Label>
          <Textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            rows={6}
            maxLength={MAX_CHARS}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {input.length} / {MAX_CHARS} characters
          </p>
        </div>

        <Button onClick={handleGenerate} disabled={loading || !input.trim()}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Generating AI response...
            </span>
          ) : 'Generate'}
        </Button>

        {response && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">AI Response:</h4>
            <p className="text-sm whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
