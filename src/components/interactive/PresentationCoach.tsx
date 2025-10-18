import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import coachData from '@/data/simulations/presentationCoach.json';

export const PresentationCoach = () => {
  const [script, setScript] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeScript = () => {
    if (!script.trim()) return;

    const words = script.trim().split(/\s+/);
    const wordCount = words.length;
    const speakingTime = Math.round(wordCount / coachData.wordsPerMinute * 10) / 10;

    const fillerCount = coachData.fillerWords.reduce((count, filler) => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      return count + (script.match(regex) || []).length;
    }, 0);

    const sentences = script.split(/[.!?]+/).filter(s => s.trim());
    const avgSentenceLength = sentences.length > 0 
      ? Math.round(wordCount / sentences.length) 
      : 0;

    setAnalysis({
      wordCount,
      speakingTime,
      fillerCount,
      avgSentenceLength,
      tips: coachData.tips
    });
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Presentation Coach</CardTitle>
        <p className="text-sm text-muted-foreground">
          Paste your presentation script for instant feedback
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="script">Your Presentation Script</Label>
          <Textarea
            id="script"
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Paste your presentation script here..."
            rows={8}
            className="mt-2"
          />
        </div>

        <Button onClick={analyzeScript} disabled={!script.trim()}>
          Analyze Script
        </Button>

        {analysis && (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Word Count</p>
                <p className="text-2xl font-bold">{analysis.wordCount}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Speaking Time</p>
                <p className="text-2xl font-bold">{analysis.speakingTime} min</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Filler Words</p>
                <p className="text-2xl font-bold">{analysis.fillerCount}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Avg Sentence Length</p>
                <p className="text-2xl font-bold">{analysis.avgSentenceLength} words</p>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Tips for Improvement:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {analysis.tips.map((tip: string, idx: number) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
