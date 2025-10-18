import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import api from '@/services/api';

const PERSONALITY_TRAITS = [
  { id: 'formal', label: 'Formal', description: 'Professional and structured' },
  { id: 'creative', label: 'Creative', description: 'Imaginative and innovative' },
  { id: 'socratic', label: 'Socratic', description: 'Asks guiding questions' },
  { id: 'encouraging', label: 'Encouraging', description: 'Supportive and positive' },
  { id: 'concise', label: 'Concise', description: 'Brief and to the point' },
  { id: 'detailed', label: 'Detailed', description: 'Thorough explanations' },
];

export const BuildABot = () => {
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [botResponse, setBotResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleTrait = (traitId: string) => {
    setSelectedTraits(prev =>
      prev.includes(traitId)
        ? prev.filter(id => id !== traitId)
        : [...prev, traitId]
    );
  };

  const handleChat = async () => {
    if (!userMessage.trim() || selectedTraits.length === 0) return;

    setLoading(true);
    setBotResponse('');
    try {
      const { data } = await api.post('/ai/generate', {
        generatorType: 'buildABot',
        userInput: userMessage,
        options: { personality: selectedTraits.join(', ') }
      });
      setBotResponse(data.response);
    } catch (error: any) {
      const errorMsg = error.response?.status === 401 
        ? 'Authentication required. Please log in to chat with your bot.'
        : error.response?.status === 503
        ? 'AI service is temporarily unavailable. Please try again later.'
        : 'Failed to get response. Please check your connection and try again.';
      setBotResponse(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Build-a-Bot: Create Your AI Assistant</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select personality traits to customize your AI assistant's behavior
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="mb-3 block">Select Personality Traits (choose 1-3):</Label>
          <div className="grid grid-cols-2 gap-3">
            {PERSONALITY_TRAITS.map(trait => (
              <div key={trait.id} className="flex items-start space-x-2">
                <Checkbox
                  id={trait.id}
                  checked={selectedTraits.includes(trait.id)}
                  onCheckedChange={() => toggleTrait(trait.id)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor={trait.id}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {trait.label}
                  </label>
                  <p className="text-xs text-muted-foreground">{trait.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedTraits.length > 0 && (
          <>
            <div>
              <Label htmlFor="message">Ask Your Custom Bot:</Label>
              <Textarea
                id="message"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ask a question..."
                rows={3}
                className="mt-2"
              />
            </div>

            <Button onClick={handleChat} disabled={loading || !userMessage.trim()}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Bot is thinking...
                </span>
              ) : 'Chat with Bot'}
            </Button>

            {botResponse && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Bot Response:</h4>
                <p className="text-sm whitespace-pre-wrap">{botResponse}</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
