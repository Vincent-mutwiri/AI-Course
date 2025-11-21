import { CheckCircle2, Circle, Play } from "lucide-react";

interface ProgressBarProps {
  current: number;
  total: number;
  completedLessons: number[];
  onLessonClick?: (lessonIndex: number) => void;
}

export const ProgressBar = ({ current, total, completedLessons, onLessonClick }: ProgressBarProps) => {
  const percentage = Math.round((completedLessons.length / total) * 100);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <span className="font-medium text-sm sm:text-base">Module Progress</span>
        <span className="text-muted-foreground text-sm">{percentage}% Complete ({completedLessons.length}/{total})</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex items-center gap-2 flex-wrap">
        {Array.from({ length: total }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onLessonClick?.(idx)}
            disabled={!onLessonClick}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-all hover:scale-105 ${
              idx === current
                ? "text-blue-600 font-semibold bg-blue-50 border border-blue-200"
                : completedLessons.includes(idx)
                ? "text-green-600 bg-green-50 border border-green-200"
                : "text-gray-400 hover:text-gray-600"
            } ${onLessonClick ? 'cursor-pointer' : 'cursor-default'}`}
          >
            {idx === current ? (
              <Play className="h-3 w-3 fill-current" />
            ) : completedLessons.includes(idx) ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <Circle className="h-3 w-3" />
            )}
            <span>L{idx + 1}</span>
          </button>
        ))}
      </div>

      {/* Mobile View */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Lesson {current + 1} of {total}</span>
          <span>{completedLessons.includes(current) ? 'Completed' : 'In Progress'}</span>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: total }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => onLessonClick?.(idx)}
              disabled={!onLessonClick}
              className={`aspect-square rounded-md flex items-center justify-center text-xs transition-all ${
                idx === current
                  ? "bg-blue-500 text-white font-semibold"
                  : completedLessons.includes(idx)
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              } ${onLessonClick ? 'active:scale-95' : ''}`}
            >
              {idx === current ? (
                <Play className="h-3 w-3 fill-current" />
              ) : completedLessons.includes(idx) ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                idx + 1
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
