import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export const VisualTokens = () => {
  const [text, setText] = useState('');
  const [tokens, setTokens] = useState<string[]>([]);

  const tokenize = (input: string) => {
    if (!input.trim()) {
      setTokens([]);
      return;
    }
    const tokenArray = input.match(/\w+|[^\w\s]/g) || [];
    setTokens(tokenArray);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Visual Tokens: See How AI Reads Text</CardTitle>
        <p className="text-sm text-muted-foreground">
          Type a sentence to see how AI breaks it into tokens
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="text-input">Enter Text</Label>
          <Textarea
            id="text-input"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              tokenize(e.target.value);
            }}
            placeholder="Type something here..."
            rows={3}
            className="mt-2"
          />
        </div>

        {tokens.length > 0 && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-3">Tokens ({tokens.length}):</h4>
            <div className="flex flex-wrap gap-2">
              {tokens.map((token, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-md text-sm font-mono"
                >
                  {token}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
