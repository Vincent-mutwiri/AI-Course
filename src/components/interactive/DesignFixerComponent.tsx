import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Hotspot {
  id: string;
  feedback: string;
  style: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
}

interface DesignFixerComponentProps {
  fixerData: {
    badSlideUrl: string;
    goodSlideUrl: string;
    hotspots: Hotspot[];
  };
}

export const DesignFixerComponent: React.FC<DesignFixerComponentProps> = ({ fixerData }) => {
  const [foundHotspots, setFoundHotspots] = useState<string[]>([]);
  const [lastFeedback, setLastFeedback] = useState<string>(
    `Click on the ${fixerData.hotspots.length} parts of this slide that create 'bad' cognitive load.`
  );

  const totalHotspots = fixerData.hotspots.length;
  const allFound = foundHotspots.length === totalHotspots;
  const progress = (foundHotspots.length / totalHotspots) * 100;

  const handleClick = (hotspot: Hotspot) => {
    if (allFound || foundHotspots.includes(hotspot.id)) return;

    setFoundHotspots([...foundHotspots, hotspot.id]);
    setLastFeedback(hotspot.feedback);

    if (foundHotspots.length + 1 === totalHotspots) {
      setLastFeedback("🎉 Great job! You found all the issues. See the difference below.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Design Fixer Challenge</CardTitle>
        <CardDescription>
          Find the cognitive load issues in this slide design
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Found {foundHotspots.length} of {totalHotspots} issues
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Feedback Box */}
        <div
          className={`p-4 rounded-lg border-2 transition-all ${
            allFound
              ? "bg-green-50 border-green-500 dark:bg-green-950/20"
              : "bg-blue-50 border-blue-500 dark:bg-blue-950/20"
          }`}
        >
          <div className="flex items-start gap-3">
            {allFound ? (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            )}
            <p className="text-base font-medium text-foreground">{lastFeedback}</p>
          </div>
        </div>

        {/* Bad Slide Container */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {allFound ? "Before (Issues Found)" : "Find the Issues"}
          </h3>
          <div
            className={`relative w-full max-w-3xl mx-auto transition-all duration-500 ${
              allFound ? "opacity-60 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <img
              src={fixerData.badSlideUrl}
              alt="Slide with design issues"
              className="w-full h-auto rounded-md shadow-lg"
            />

            {/* Hotspot Overlays */}
            {fixerData.hotspots.map((hotspot) => {
              const isFound = foundHotspots.includes(hotspot.id);
              return (
                <button
                  key={hotspot.id}
                  aria-label={`Find design flaw: ${hotspot.id}`}
                  onClick={() => handleClick(hotspot)}
                  disabled={isFound}
                  className={`absolute border-2 rounded-md transition-all duration-300 ${
                    isFound
                      ? "border-green-500 bg-green-500/30 backdrop-blur-sm cursor-default"
                      : "border-dashed border-red-500 hover:bg-red-500/20 hover:border-solid cursor-pointer animate-pulse"
                  }`}
                  style={{
                    top: hotspot.style.top,
                    left: hotspot.style.left,
                    width: hotspot.style.width,
                    height: hotspot.style.height,
                  }}
                >
                  {isFound && (
                    <div className="w-full h-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Good Slide Reveal */}
        {allFound && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              After (Fixed Version)
            </h3>
            <div className="relative w-full max-w-3xl mx-auto">
              <img
                src={fixerData.goodSlideUrl}
                alt="Slide with improved design"
                className="w-full h-auto rounded-md shadow-xl ring-2 ring-green-500/50"
              />
              <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                ✓ Fixed
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Key Improvements:</strong> Notice how the fixed version reduces cognitive
                load by using simpler language, larger fonts, and removing distracting elements.
                This makes the content easier to process and understand.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
