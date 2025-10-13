import Chatbot from '@/components/interactive/Chatbot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Module3 = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Module 3: Technical Integration with Inflection AI API</h1>

      <Card>
        <CardHeader>
          <CardTitle>AI Chatbot with Conversation History</CardTitle>
        </CardHeader>
        <CardContent>
          <Chatbot />
        </CardContent>
      </Card>
    </div>
  );
};

export default Module3;
