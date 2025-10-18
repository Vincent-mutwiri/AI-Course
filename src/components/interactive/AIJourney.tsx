import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { progressAPI } from '@/services/api';
import { CheckCircle2, Circle } from 'lucide-react';

export const AIJourney = () => {
  const { courseId } = useParams();
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await progressAPI.get(courseId!);
        setProgress(data.progress);
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId) fetchProgress();
  }, [courseId]);

  if (loading) return <div>Loading your journey...</div>;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>My AI Learning Journey</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your progress through the course
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progress?.moduleProgress?.map((module: any, idx: number) => (
            <div key={idx} className="flex items-start gap-3">
              {module.completedLessons?.length > 0 ? (
                <CheckCircle2 className="h-6 w-6 text-green-600 mt-1" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground mt-1" />
              )}
              <div className="flex-1">
                <h4 className="font-medium">Module {idx + 1}</h4>
                <p className="text-sm text-muted-foreground">
                  {module.completedLessons?.length || 0} lessons completed
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
