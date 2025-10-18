import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import api from '@/services/api';

interface AIGeneratorProps {
  generatorType: string;
  title: string;
  description?: string;
  placeholder?: string;
  options?: Record<string, any>;
}

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
    if (!input.trim()) return;

    setLoading(true);
    setResponse('');
    try {
      const { data } = await api.post('/ai/generate', {
        generatorType,
        userInput: input,
        options
      });
      setResponse(data.response);
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
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="input">Your Input</Label>
          <Textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            rows={6}
            className="mt-2"
          />
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
