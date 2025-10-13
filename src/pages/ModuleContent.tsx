import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import EthicalDilemmaSolver from '@/components/interactive/EthicalDilemmaSolver';
import AISketch from '@/components/interactive/AISketch';
import Chatbot from '@/components/interactive/Chatbot';
import AIQuiz from '@/components/interactive/AIQuiz';

interface Lesson {
  title: string;
  description: string;
  duration: number;
}

interface CourseModule {
  _id: string;
  title: string;
  description: string;
  duration: number;
  order: number;
  lessons: Lesson[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  modules: CourseModule[];
}

const ModuleContent = () => {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      
      try {
        const { course } = await courseAPI.getById(courseId);
        setCourse(course);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return <div className="p-4">Error loading course: {error?.message || 'Course not found'}</div>;
  }

  const module = course.modules?.find((m: CourseModule) => m._id === moduleId);
  if (!module) {
    return <div className="p-4">Module not found in this course</div>;
  }

  const renderModuleContent = () => {
    if (module.order === 1) {
      return (
        <div className="space-y-8 mt-6">
          <h2 className="text-3xl font-bold">Module 1: Foundations of Responsible AI in EdTech</h2>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Lesson 1.3: Safety and Data Ethics</h3>
            <p>Content Safety: Protecting learners from harmful content.</p>
            <p>Algorithmic Fairness: Ensuring AI decisions are unbiased.</p>
            <p>Data Ethics: Transparency, Consent, and Security in handling student data.</p>
          </div>
          <div className="mt-8">
            <EthicalDilemmaSolver />
          </div>
        </div>
      );
    }
    
    if (module.order === 2) {
      return (
        <div className="space-y-8 mt-6">
          <h2 className="text-3xl font-bold">Module 2: Designing Practical AI Features</h2>
          <div className="space-y-4">
            <p className="text-lg">Identify ONE feature in your product that could responsibly leverage AI to enhance learner outcomes.</p>
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">The "AI Sketch" Activity</h3>
            <AISketch />
          </div>
        </div>
      );
    }
    
    if (module.order === 3) {
      return (
        <div className="space-y-8 mt-6">
          <h2 className="text-3xl font-bold">Module 3: Technical Integration with Inflection AI API</h2>
          <div className="space-y-4">
            <p className="text-lg">Learn how to integrate AI capabilities into your educational platform.</p>
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">AI Chatbot with Conversation History</h3>
            <Chatbot />
          </div>
        </div>
      );
    }
    
    if (module.order === 4) {
      return (
        <div className="space-y-8 mt-6">
          <h2 className="text-3xl font-bold">Module 4: Building Interactive Course Components</h2>
          <div className="space-y-4">
            <p className="text-lg">Create engaging, AI-powered assessments for your learners.</p>
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">AI-Generated Quiz</h3>
            <AIQuiz topic="The core principles of Responsible AI in EdTech" />
          </div>
        </div>
      );
    }
    
    return (
      <div className="prose max-w-none">
        <p>Module content coming soon.</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(`/course/${courseId}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Course
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{module.title}</CardTitle>
          {module.description && (
            <p className="text-muted-foreground mt-2">{module.description}</p>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {renderModuleContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleContent;
