import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/services/api';

// Default journey steps (can be overridden via props)
const defaultJourneySteps = [
  {
    id: 'module_1',
    title: 'Defined Cognitive Load',
    description: "You learned *why* the brain's bottleneck matters and how to reduce extraneous load."
  },
  {
    id: 'module_2',
    title: 'Explored Motivation (AMP)',
    description: "You used the 'AMP' framework to analyze what truly drives student engagement."
  },
  {
    id: 'module_3',
    title: 'Built an AI-Powered Activity',
    description: "You used AI to convert a passive lesson into an active learning experience."
  },
  {
    id: 'module_4',
    title: "Practiced 'Feedback that Feeds Forward'",
    description: "You mastered the 'GPS vs. Stop Sign' concept for effective feedback."
  },
  {
    id: 'module_5',
    title: 'Completed Your Journey!',
    description: "You've finished the course and are ready to apply learning science in your classroom."
  }
];

interface JourneyStep {
  id: string;
  title: string;
  description: string;
}

interface AIJourneyComponentProps {
  data: {
    title?: string;
    steps?: JourneyStep[];
  };
}

export const AIJourneyComponent: React.FC<AIJourneyComponentProps> = ({ data }) => {
  const journeySteps = data.steps || defaultJourneySteps;
  const [completedModules, setCompletedModules] = useState<number>(0);
  const [stats, setStats] = useState({ aiRequests: 0, reflections: 0, interactions: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch progress data
        const courseId = 'learning_science_playbook'; // You can pass this as prop if needed

        // Get user's course progress
        const progressResponse = await api.get(`/progress/${courseId}`);

        // Count completed modules based on completed lessons
        const progress = progressResponse.data.progress;
        let completedCount = 0;

        if (progress && progress.moduleProgress) {
          // Count modules where at least one lesson is completed
          completedCount = progress.moduleProgress.filter((mp: any) =>
            mp.completedLessons && mp.completedLessons.length > 0
          ).length;
        }

        setCompletedModules(completedCount);

        // Simulate stats (in a real implementation, fetch from analytics API)
        // For now, use localStorage to count interactions
        const aiCount = parseInt(localStorage.getItem('ai_interactions_count') || '0');
        const reflectionCount = parseInt(localStorage.getItem('reflection_count') || '0');
        const totalInteractions = parseInt(localStorage.getItem('total_interactions') || '0');

        setStats({
          aiRequests: aiCount,
          reflections: reflectionCount,
          interactions: totalInteractions || (aiCount + reflectionCount)
        });

      } catch (error) {
        console.error("Error fetching journey data", error);
        // Set some default values on error
        setCompletedModules(0);
        setStats({ aiRequests: 0, reflections: 0, interactions: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-96" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">{data.title || "Your Learning Science Journey"}</CardTitle>
        </div>
        <CardDescription>
          You've defined Cognitive Load, explored Motivation, built AI-powered activities, and crafted better feedback. You're ready!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline */}
        <div className="relative">
          <ol className="relative border-l-2 border-muted ml-4">
            {journeySteps.map((step, index) => {
              const isComplete = index < completedModules || index === journeySteps.length - 1;

              return (
                <li key={step.id} className="mb-10 ml-8">
                  <span className={`absolute flex items-center justify-center w-10 h-10 rounded-full -left-5 ring-4 ring-background ${isComplete ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'
                    }`}>
                    {isComplete ? (
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                  </span>
                  <div className={`transition-all duration-300 ${isComplete ? 'opacity-100' : 'opacity-60'}`}>
                    <h4 className="flex items-center mb-2 text-lg font-semibold">
                      {step.title}
                      {isComplete && index < journeySteps.length - 1 && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                          ✓ Complete
                        </span>
                      )}
                    </h4>
                    <p className="text-base text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Stats Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 border-2 border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h4 className="text-lg font-semibold">Your Impact</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-background rounded-lg">
              <p className="text-3xl font-bold text-primary">{completedModules}</p>
              <p className="text-sm text-muted-foreground mt-1">Modules Completed</p>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{stats.aiRequests}</p>
              <p className="text-sm text-muted-foreground mt-1">AI Tools Used</p>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <p className="text-3xl font-bold text-green-600">{stats.reflections}</p>
              <p className="text-sm text-muted-foreground mt-1">Reflections Made</p>
            </div>
          </div>
          <p className="text-center mt-4 text-sm text-muted-foreground">
            You've engaged with {stats.interactions} interactive elements throughout your journey!
          </p>
        </div>

        {/* Encouragement */}
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <p className="text-lg font-medium">
            🎉 You've come so far! You're now equipped with evidence-based strategies to transform your teaching.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Complete the final assessment to earn your certificate and officially become a Learning Science Practitioner!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
