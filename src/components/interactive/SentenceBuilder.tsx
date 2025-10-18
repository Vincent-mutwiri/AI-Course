import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const predictionModel: Record<string, string[]> = {
  "Artificial": ["intelligence", "life", "neural", "systems", "networks"],
  "intelligence": ["is", "can", "will", "helps", "transforms", "enables"],
  "is": ["a", "the", "transforming", "revolutionizing", "changing", "improving"],
  "a": ["powerful", "technology", "tool", "system", "breakthrough", "game-changer"],
  "powerful": ["tool", "technology", "system", "force", "innovation", "solution"],
  "tool": ["that", "for", "which", "to", "helping", "enabling"],
  "that": ["helps", "can", "enables", "allows", "transforms", "improves"],
  "helps": ["us", "students", "teachers", "people", "everyone", "learners"],
  "us": ["learn", "understand", "solve", "create", "discover", "explore"],
  "learn": ["faster", "better", "more", "efficiently", "effectively", "easily"],
  "can": ["help", "transform", "improve", "enhance", "revolutionize", "change"],
  "transform": ["education", "learning", "teaching", "schools", "classrooms", "students"],
  "education": ["by", "through", "with", "for", "using", "via"],
  "by": ["providing", "offering", "enabling", "creating", "delivering", "supporting"],
  "The": ["future", "power", "potential", "impact", "revolution", "transformation"],
  "Machine": ["learning", "intelligence", "algorithms", "models", "systems", "technology"],
  "transforming": ["education", "learning", "teaching", "schools", "how", "the"],
  "revolutionizing": ["education", "learning", "teaching", "how", "the", "our"],
  "changing": ["education", "learning", "how", "the", "our", "everything"],
  "improving": ["education", "learning", "outcomes", "results", "performance", "understanding"]
};

export const SentenceBuilder = () => {
  const [sentence, setSentence] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<string[]>([]);

  const model = predictionModel;

  const addWord = (word: string) => {
    const newSentence = [...sentence, word];
    setSentence(newSentence);
    
    const nextPredictions = model[word] || [];
    const numPredictions = Math.min(3 + newSentence.length, 6);
    setPredictions(nextPredictions.slice(0, numPredictions));
  };

  const reset = () => {
    setSentence([]);
    setPredictions(Object.keys(model).slice(0, 3));
  };

  if (sentence.length === 0 && predictions.length === 0) {
    setPredictions(['Artificial', 'The', 'Machine']);
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sentence Builder: AI Predictions</CardTitle>
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
