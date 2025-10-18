import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import predictionData from '@/data/simulations/sentenceBuilder.json';

export const SentenceBuilder = () => {
  const [sentence, setSentence] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<string[]>([]);

  const model = predictionData.predictionModel as Record<string, string[]>;

  const addWord = (word: string) => {
    const newSentence = [...sentence, word];
    setSentence(newSentence);
    
    const nextPredictions = model[word] || [];
    setPredictions(nextPredictions.slice(0, 3));
  };

  const reset = () => {
    setSentence([]);
    setPredictions(Object.keys(model).slice(0, 3));
  };

  if (sentence.length === 0 && predictions.length === 0) {
    setPredictions(Object.keys(model).slice(0, 3));
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Sentence Builder: AI Predictions</CardTitle>
        <p className="text-sm text-muted-foreground">
          Click words to build a sentence. See how AI predicts the next word!
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="min-h-[60px] p-4 bg-muted/50 rounded-lg">
          <p className="text-lg">
            {sentence.length > 0 ? sentence.join(' ') : 'Start building your sentence...'}
          </p>
        </div>

        {predictions.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">AI Predictions:</h4>
            <div className="flex flex-wrap gap-2">
              {predictions.map((word, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  onClick={() => addWord(word)}
                  className="capitalize"
                >
                  {word}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
      </CardContent>
    </Card>
  );
};
