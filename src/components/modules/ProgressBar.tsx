import { CheckCircle2, Circle } from "lucide-react";

interface ProgressBarProps {
  current: number;
  total: number;
  completedLessons: number[];
}

export const ProgressBar = ({ current, total, completedLessons }: ProgressBarProps) => {
  const percentage = Math.round((completedLessons.length / total) * 100);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">Course Progress</span>
        <span className="text-muted-foreground">{percentage}% Complete</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {Array.from({ length: total }).map((_, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1 text-xs ${
              idx === current
                ? "text-blue-600 font-semibold"
                : completedLessons.includes(idx)
                ? "text-green-600"
                : "text-gray-400"
            }`}
          >
            {completedLessons.includes(idx) ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
            <span>{idx + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
