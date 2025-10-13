import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import api from '@/services/api';

const AISketch = () => {
  const [sketch, setSketch] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/ai/ai-sketch-feedback', { sketch });
      setFeedback(data.feedback);
    } catch (error) {
      setFeedback('There was an error getting feedback from the AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Textarea
        placeholder="Describe your AI feature idea here..."
        value={sketch}
        onChange={(e) => setSketch(e.target.value)}
        className="min-h-32"
      />
      <Button onClick={handleSubmit} disabled={loading || !sketch.trim()} className="mt-2">
        {loading ? 'Getting Feedback...' : 'Get Feedback'}
      </Button>
      {feedback && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <p className="whitespace-pre-wrap">{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default AISketch;
