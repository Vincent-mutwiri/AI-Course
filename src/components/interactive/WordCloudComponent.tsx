import { useState } from 'react';
import * as simData from '@/data/simulations/wordCloudData';
import { Lightbulb, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WordCloudProps {
  title?: string;
  dataKey: keyof typeof simData;
  description?: string;
}

export const WordCloudComponent: React.FC<WordCloudProps> = ({ 
  title = "Community Insights", 
  dataKey,
  description = "Click on a word to see which motivation principle it connects to!"
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [mapping, setMapping] = useState<string | null>(null);

  const data = simData[dataKey];
  
  if (!data) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-destructive">Error: Could not load simulation data for "{dataKey}"</p>
        </CardContent>
      </Card>
    );
  }

  const handleWordClick = (word: string) => {
    const mappedValue = data.mappings[word];
    if (mappedValue) {
      setSelectedWord(word);
      setMapping(mappedValue);
    }
  };

  // Sort words by value for better visual hierarchy
  const sortedWords = [...data.words].sort((a, b) => b.value - a.value);

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
              👆 Click on any word above to discover its connection to learner motivation
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
                  This is a fantastic example of <span className="font-bold text-purple-600 dark:text-purple-400">{mapping}</span>.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  When educators mention "{selectedWord}" as their secret ingredient, they're tapping into 
                  the power of {mapping} to fuel intrinsic motivation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>What you're seeing:</strong> These are the most common "secret ingredients" 
            mentioned by {data.words.length * 100}+ educators. Notice how they all connect back to 
            Autonomy, Mastery, or Purpose—the three pillars of intrinsic motivation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
