import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { courseAPI, progressAPI } from '@/services/api';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ContentRenderer } from '@/components/modules/ContentRenderer';
import { InteractiveElement } from '@/components/modules/InteractiveElement';
import { InteractiveElementRouter } from '@/components/interactive/InteractiveElementRouter';
import { QuizComponent } from '@/components/modules/QuizComponent';
import { CodeSnippet } from '@/components/modules/CodeSnippet';
import { ProgressBar } from '@/components/modules/ProgressBar';
import { useAuth } from '@/context/AuthContext';

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
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [progress, setProgress] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const module = course?.modules?.find((m: CourseModule) => m._id === moduleId);

  const handleContentUpdate = () => {
    // Refresh the course data
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    if (!module) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'ArrowLeft' && currentLesson > 0) {
          e.preventDefault();
          handlePrevLesson();
        } else if (e.key === 'ArrowRight' && currentLesson < module.lessons.length - 1) {
          e.preventDefault();
          handleNextLesson();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentLesson, module]);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;

      try {
        const courseData = await courseAPI.getById(courseId + '?t=' + Date.now());
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
          console.log('No progress found, attempting auto-enrollment...', progressErr);

          // Auto-enroll user if they're not enrolled yet
          try {
            console.log('Enrolling in course:', courseId);
            const enrollmentResult = await courseAPI.enroll(courseId);
            console.log('Enrollment successful:', enrollmentResult);

            toast.success('Welcome! You have been enrolled in this course.', {
              description: 'You can now access all course materials.'
            });

            // Fetch progress again after enrollment
            try {
              const progressData = await progressAPI.get(courseId);
              setProgress(progressData.progress);
              console.log('Progress fetched after enrollment:', progressData);
            } catch (err) {
              console.log('Progress will be created as you learn', err);
            }
          } catch (enrollErr: any) {
            console.error('Auto-enrollment error details:', {
              status: enrollErr.response?.status,
              message: enrollErr.response?.data?.message,
              fullError: enrollErr
            });

            // Check if already enrolled
            if (enrollErr.response?.status === 400 && enrollErr.response?.data?.message === 'Already enrolled') {
              console.log('User already enrolled, progress will be created');
              toast.info('You are already enrolled in this course');
            } else {
              console.error('Auto-enrollment failed:', enrollErr);
              toast.error('Failed to enroll in course', {
                description: enrollErr.response?.data?.message || 'Please try enrolling from the course page.'
              });
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId, moduleId, refreshKey]);

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
    } else {
      navigate(`/course/${courseId}`);
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
        toast.success('Lesson completed! Great job!');

        // Track analytics
        api.post('/analytics/track', {
          courseId,
          eventType: 'lesson_complete',
          moduleId,
          lessonIndex: currentLesson
        }).catch((err: unknown) => console.error('Analytics tracking failed:', err));
      } catch (err) {
        console.error('Failed to update progress:', err);
        toast.error('Failed to save progress. Please try again.');
      }
    }
  };

  const handleLessonClick = async (lessonIndex: number) => {
    if (lessonIndex !== currentLesson) {
      setCurrentLesson(lessonIndex);
      await progressAPI.updateAccess(courseId!, moduleId!, lessonIndex);
    }
  };

  const handleQuizComplete = async (score: number) => {
    try {
      const updated = await progressAPI.updateLesson(courseId!, moduleId!, currentLesson, true, score);
      const moduleProgress = updated.progress.moduleProgress.find((m: any) => m.moduleId === moduleId);
      setCompletedLessons(moduleProgress?.completedLessons || []);
      toast.success(`Quiz completed! Score: ${score}%`);
    } catch (err) {
      console.error('Failed to save quiz score:', err);
      toast.error('Failed to save quiz score.');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: course.title, href: `/course/${courseId}` },
          { label: module.title, current: true }
        ]}
        className="mb-6"
      />

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
                onLessonClick={handleLessonClick}
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
              {lesson.content && (
                <ContentRenderer
                  sections={Array.isArray(lesson.content) ? lesson.content : lesson.content.sections || []}
                  courseId={courseId}
                  moduleId={moduleId}
                  lessonIndex={currentLesson}
                  onContentUpdate={handleContentUpdate}
                />
              )}

              {/* Interactive Element */}
              {lesson.interactive && (
                <InteractiveElement interactive={lesson.interactive} />
              )}

              {/* Interactive Elements */}
              {lesson.interactiveElements && lesson.interactiveElements.length > 0 && (
                <div className="space-y-6">
                  {lesson.interactiveElements.map((element, idx) => (
                    <InteractiveElementRouter
                      key={`interactive-${moduleId}-${currentLesson}-${idx}`}
                      element={element}
                      userName={user?.name || 'Learner'}
                    />
                  ))}
                </div>
              )}

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
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevLesson}
                  disabled={currentLesson === 0}
                  title="Ctrl/Cmd + Left Arrow"
                  className="w-full sm:w-auto"
                >
                  ← Previous Lesson
                </Button>
                <div className="text-sm text-muted-foreground text-center hidden sm:block">
                  <div>Lesson {currentLesson + 1} of {module.lessons.length}</div>
                  <div className="text-xs mt-1">Use Ctrl/Cmd + Arrow keys to navigate</div>
                </div>
                <Button
                  onClick={handleNextLesson}
                  title="Ctrl/Cmd + Right Arrow"
                  className="w-full sm:w-auto"
                >
                  {currentLesson === module.lessons.length - 1 ? 'Back to Course' : 'Next Lesson →'}
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
