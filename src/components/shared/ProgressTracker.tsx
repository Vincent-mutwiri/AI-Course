import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle } from "lucide-react";

interface ProgressTrackerProps {
  modules: Array<{
    title: string;
    lessons: Array<{
      title: string;
      duration: number;
    }>;
  }>;
  progress: Array<{
    lessonId: string;
    completed: boolean;
  }>;
  onLessonClick?: (moduleIndex: number, lessonIndex: number) => void;
}

export default function ProgressTracker({ modules, progress, onLessonClick }: ProgressTrackerProps) {
  const getLessonId = (moduleIndex: number, lessonIndex: number) => {
    return `${moduleIndex}-${lessonIndex}`;
  };

  const isLessonCompleted = (moduleIndex: number, lessonIndex: number) => {
    const lessonId = getLessonId(moduleIndex, lessonIndex);
    return progress.some((p) => p.lessonId === lessonId && p.completed);
  };

  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = progress.filter((p) => p.completed).length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Progress</CardTitle>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span className="font-semibold">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="space-y-2">
            <h3 className="font-semibold">{module.title}</h3>
            <div className="space-y-1">
              {module.lessons.map((lesson, lessonIndex) => {
                const completed = isLessonCompleted(moduleIndex, lessonIndex);
                return (
                  <button
                    key={lessonIndex}
                    onClick={() => onLessonClick?.(moduleIndex, lessonIndex)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    {completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm ${completed ? "line-through text-muted-foreground" : ""}`}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{lesson.duration}m</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
