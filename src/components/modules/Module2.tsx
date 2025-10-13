import AISketch from '@/components/interactive/AISketch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Module2 = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Module 2: Designing Practical AI Features</h1>

      <Card>
        <CardHeader>
          <CardTitle>The "AI Sketch" Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Identify ONE feature in your product that could responsibly leverage AI to enhance learner outcomes.
          </p>
          <AISketch />
        </CardContent>
      </Card>
    </div>
  );
};

export default Module2;
