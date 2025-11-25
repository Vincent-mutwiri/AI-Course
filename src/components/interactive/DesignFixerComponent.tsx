import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Settings } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { useAuth } from "@/context/AuthContext";
import { HotspotEditor } from "@/components/admin/HotspotEditor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  onUpdate?: (updatedData: any) => void;
}

export const DesignFixerComponent: React.FC<DesignFixerComponentProps> = ({ fixerData, onUpdate }) => {
  // Ensure fixerData and hotspots exist with defaults
  const initialHotspots = fixerData?.hotspots || [];
  const initialBadSlideUrl = fixerData?.badSlideUrl || '';
  const initialGoodSlideUrl = fixerData?.goodSlideUrl || '';

  const [foundHotspots, setFoundHotspots] = useState<string[]>([]);
  const [lastFeedback, setLastFeedback] = useState<string>(
    `Click on the ${initialHotspots.length} parts of this slide that create 'bad' cognitive load.`
  );
  const [badSlideUrl, setBadSlideUrl] = useState(initialBadSlideUrl);
  const [goodSlideUrl, setGoodSlideUrl] = useState(initialGoodSlideUrl);
  const [hotspots, setHotspots] = useState<Hotspot[]>(initialHotspots);
  const [editorOpen, setEditorOpen] = useState(false);

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const totalHotspots = hotspots.length;
  const allFound = foundHotspots.length === totalHotspots && totalHotspots > 0;
  const progress = totalHotspots > 0 ? (foundHotspots.length / totalHotspots) * 100 : 0;

  const handleBadSlideUpdate = (url: string) => {
    setBadSlideUrl(url);
    if (onUpdate) {
      onUpdate({ ...fixerData, badSlideUrl: url, hotspots });
    }
  };

  const handleGoodSlideUpdate = (url: string) => {
    setGoodSlideUrl(url);
    if (onUpdate) {
      onUpdate({ ...fixerData, goodSlideUrl: url, hotspots });
    }
  };

  const handleHotspotsSave = (updatedHotspots: Hotspot[]) => {
    setHotspots(updatedHotspots);
    setLastFeedback(`Click on the ${updatedHotspots.length} parts of this slide that create 'bad' cognitive load.`);
    if (onUpdate) {
      onUpdate({ badSlideUrl, goodSlideUrl, hotspots: updatedHotspots });
    }
    setEditorOpen(false);
  };

  const handleClick = (hotspot: Hotspot) => {
    if (allFound || foundHotspots.includes(hotspot.id)) return;

    setFoundHotspots([...foundHotspots, hotspot.id]);
    setLastFeedback(hotspot.feedback);

    if (foundHotspots.length + 1 === totalHotspots) {
      setLastFeedback("🎉 Great job! You found all the issues. See the difference below.");
    }
  };

  // If no configuration provided, show a message
  if (!badSlideUrl || hotspots.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Design Fixer Challenge</CardTitle>
          <CardDescription>
            Find the cognitive load issues in this slide design
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This component needs to be configured with a slide image and hotspots.
          </p>
          {isAdmin && (
            <div className="mt-4 space-y-2">
              <ImageUploader
                currentUrl={badSlideUrl}
                onImageUpdate={handleBadSlideUpdate}
                label="Bad Slide"
                folder="design-fixer"
              />
              <Button onClick={() => setEditorOpen(true)} variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Add Hotspots
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Design Fixer Challenge</CardTitle>
            <CardDescription>
              Find the cognitive load issues in this slide design
            </CardDescription>
          </div>
          {isAdmin && (
            <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Hotspots
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Hotspot Editor</DialogTitle>
                  <DialogDescription>
                    Adjust hotspot positions and feedback for the Design Fixer challenge
                  </DialogDescription>
                </DialogHeader>
                <HotspotEditor
                  imageUrl={badSlideUrl}
                  hotspots={hotspots}
                  onSave={handleHotspotsSave}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
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
          className={`p-4 rounded-lg border-2 transition-all ${allFound
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {allFound ? "Before (Issues Found)" : "Find the Issues"}
            </h3>
            {isAdmin && (
              <ImageUploader
                currentUrl={badSlideUrl}
                onImageUpdate={handleBadSlideUpdate}
                label="Bad Slide"
                folder="design-fixer"
              />
            )}
          </div>
          <div
            className={`relative w-full max-w-3xl mx-auto transition-all duration-500 ${allFound ? "opacity-60 scale-95" : "opacity-100 scale-100"
              }`}
          >
            <img
              src={badSlideUrl}
              alt="Slide with design issues"
              className="w-full h-auto rounded-md shadow-lg"
            />

            {/* Hotspot Overlays */}
            {hotspots.map((hotspot) => {
              const isFound = foundHotspots.includes(hotspot.id);
              return (
                <button
                  key={hotspot.id}
                  aria-label={`Find design flaw: ${hotspot.id}`}
                  onClick={() => handleClick(hotspot)}
                  disabled={isFound}
                  className={`absolute border-2 rounded-md transition-all duration-300 ${isFound
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                After (Fixed Version)
              </h3>
              {isAdmin && (
                <ImageUploader
                  currentUrl={goodSlideUrl}
                  onImageUpdate={handleGoodSlideUpdate}
                  label="Good Slide"
                  folder="design-fixer"
                />
              )}
            </div>
            <div className="relative w-full max-w-3xl mx-auto">
              <img
                src={goodSlideUrl}
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
