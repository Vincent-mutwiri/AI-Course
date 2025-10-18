import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, progressAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import { ContentRenderer } from '@/components/modules/ContentRenderer';
import { InteractiveElement } from '@/components/modules/InteractiveElement';
import { InteractiveElementRouter } from '@/components/interactive/InteractiveElementRouter';
import { QuizComponent } from '@/components/modules/QuizComponent';
import { CodeSnippet } from '@/components/modules/CodeSnippet';
import { ProgressBar } from '@/components/modules/ProgressBar';

interface Lesson {
  title: string;
  description: string;
  duration: number;
  objective?: string;
  content?: any;
  interactive?: any;
  interactiveElements?: any[];
  quiz?: any;
  codeSnippet?: any;
  order: number;
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
  const [currentLesson, setCurrentLesson] = useState(0);
  const [progress, setProgress] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      
      try {
        const courseData = await courseAPI.getById(courseId);
        setCourse(courseData.course);
        
        try {
          const progressData = await progressAPI.get(courseId);
          setProgress(progressData.progress);
          
          const moduleProgress = progressData.progress?.moduleProgress?.find(
            (m: any) => m.moduleId === moduleId
          );
          
          if (moduleProgress) {
            setCurrentLesson(moduleProgress.currentLesson || 0);
            setCompletedLessons(moduleProgress.completedLessons || []);
          }
        } catch (progressErr) {
          console.log('No progress found, starting fresh');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [courseId, moduleId]);

  const module = course?.modules?.find((m: CourseModule) => m._id === moduleId);
  const lesson = module?.lessons?.[currentLesson];

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

  if (!module) {
    return <div className="p-4">Module not found in this course</div>;
  }

  const handleNextLesson = async () => {
    if (currentLesson < module.lessons.length - 1) {
      const nextLesson = currentLesson + 1;
      setCurrentLesson(nextLesson);
      await progressAPI.updateAccess(courseId!, moduleId!, nextLesson);
    }
  };

  const handlePrevLesson = async () => {
    if (currentLesson > 0) {
      const prevLesson = currentLesson - 1;
      setCurrentLesson(prevLesson);
      await progressAPI.updateAccess(courseId!, moduleId!, prevLesson);
    }
  };

  const handleCompleteLesson = async () => {
    if (!completedLessons.includes(currentLesson)) {
      try {
        const updated = await progressAPI.updateLesson(courseId!, moduleId!, currentLesson, true);
        const moduleProgress = updated.progress.moduleProgress.find((m: any) => m.moduleId === moduleId);
        setCompletedLessons(moduleProgress?.completedLessons || []);
      } catch (err) {
        console.error('Failed to update progress:', err);
      }
    }
  };

  const handleQuizComplete = async (score: number) => {
    try {
      const updated = await progressAPI.updateLesson(courseId!, moduleId!, currentLesson, true, score);
      const moduleProgress = updated.progress.moduleProgress.find((m: any) => m.moduleId === moduleId);
      setCompletedLessons(moduleProgress?.completedLessons || []);
    } catch (err) {
      console.error('Failed to save quiz score:', err);
    }
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
          {lesson ? (
            <div className="space-y-8">
              {/* Progress Bar */}
              <ProgressBar
                current={currentLesson}
                total={module.lessons.length}
                completedLessons={completedLessons}
              />

              {/* Lesson Header */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{lesson.title}</h2>
                    {completedLessons.includes(currentLesson) && (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {lesson.duration} min
                  </div>
                </div>
                {lesson.objective && (
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Objective:</span> {lesson.objective}
                  </p>
                )}
              </div>

              {/* Lesson Content */}
              {lesson.content?.sections && (
                <ContentRenderer sections={lesson.content.sections} />
              )}

              {/* Interactive Element */}
              {lesson.interactive && (
                <InteractiveElement interactive={lesson.interactive} />
              )}

              {/* Interactive Elements (New) */}
              {lesson.interactiveElements?.map((element, idx) => (
                <InteractiveElementRouter key={idx} element={element} />
              ))}

              {/* Code Snippet */}
              {lesson.codeSnippet && (
                <CodeSnippet codeSnippet={lesson.codeSnippet} />
              )}

              {/* Quiz */}
              {lesson.quiz && (
                <QuizComponent quiz={lesson.quiz} onComplete={handleQuizComplete} />
              )}

              {/* Complete Lesson Button */}
              {!completedLessons.includes(currentLesson) && !lesson.quiz && (
                <Button onClick={handleCompleteLesson} className="w-full" size="lg">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Mark as Complete
                </Button>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevLesson}
                  disabled={currentLesson === 0}
                >
                  ← Previous Lesson
                </Button>
                <div className="text-sm text-muted-foreground">
                  Lesson {currentLesson + 1} of {module.lessons.length}
                </div>
                <Button
                  onClick={handleNextLesson}
                  disabled={currentLesson === module.lessons.length - 1}
                >
                  Next Lesson →
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No lessons available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleContent;
