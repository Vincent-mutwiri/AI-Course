import { useState } from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WordData {
  text: string;
  value: number;
}

interface WordCloudProps {
  title?: string;
  description?: string;
  words?: WordData[];
  mappings?: Record<string, string>;
  instructionText?: string;
  summaryText?: string;
}

export const WordCloudComponent: React.FC<WordCloudProps> = ({
  title = "Community Insights",
  description = "Click on a word to see which motivation principle it connects to!",
  words = [],
  mappings = {},
  instructionText,
  summaryText
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [mapping, setMapping] = useState<string | null>(null);

  // Check if component is properly configured
  if (!words || words.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No words configured</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            This word cloud needs to be configured with words and mappings.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleWordClick = (word: string) => {
    const mappedValue = mappings[word];
    if (mappedValue) {
      setSelectedWord(word);
      setMapping(mappedValue);
    }
  };

  // Sort words by value for better visual hierarchy
  const sortedWords = [...words].sort((a, b) => b.value - a.value);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Custom Word Cloud - Button Grid */}
        <div className="min-h-80 w-full border-2 border-dashed rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="flex flex-wrap gap-3 justify-center items-center">
            {sortedWords.map((word) => {
              const isSelected = selectedWord === word.text;
              // Calculate font size based on value (20-60px range)
              const fontSize = Math.floor(20 + (word.value / 100) * 40);

              return (
                <Button
                  key={word.text}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => handleWordClick(word.text)}
                  className={`
                    transition-all duration-300 hover:scale-110
                    ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                  `}
                  style={{
                    fontSize: `${fontSize}px`,
                    padding: `${fontSize / 4}px ${fontSize / 2}px`,
                  }}
                >
                  {word.text}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Instruction */}
        {!selectedWord && (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {instructionText || "👆 Click on any word above to discover its connection"}
            </p>
          </div>
        )}

        {/* Mapping Reveal */}
        {selectedWord && mapping && (
          <div className="p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 border-2 border-primary/30 rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  You clicked <span className="text-primary font-bold">"{selectedWord}"</span>!
                </p>
                <p className="text-lg">
                  This connects to: <span className="font-bold text-purple-600 dark:text-purple-400">{mapping}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        {summaryText && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>What you're seeing:</strong> {summaryText}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
