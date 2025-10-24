import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Save } from "lucide-react";

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

interface HotspotEditorProps {
  imageUrl: string;
  hotspots: Hotspot[];
  onSave: (hotspots: Hotspot[]) => void;
}

export const HotspotEditor: React.FC<HotspotEditorProps> = ({ imageUrl, hotspots, onSave }) => {
  const [editableHotspots, setEditableHotspots] = useState<Hotspot[]>(hotspots);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setIsDrawing(true);
    setDrawStart({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !drawStart || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Update preview (you could show a temporary rectangle here)
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing || !drawStart || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newHotspot: Hotspot = {
      id: `hotspot_${Date.now()}`,
      feedback: "New hotspot - edit feedback",
      style: {
        top: `${Math.min(drawStart.y, y)}%`,
        left: `${Math.min(drawStart.x, x)}%`,
        width: `${Math.abs(x - drawStart.x)}%`,
        height: `${Math.abs(y - drawStart.y)}%`,
      }
    };
    
    setEditableHotspots([...editableHotspots, newHotspot]);
    setIsDrawing(false);
    setDrawStart(null);
    setSelectedHotspot(newHotspot.id);
  };

  const updateHotspot = (id: string, field: string, value: string) => {
    setEditableHotspots(editableHotspots.map(h => {
      if (h.id === id) {
        if (field === 'feedback') {
          return { ...h, feedback: value };
        } else if (field === 'id') {
          return { ...h, id: value };
        } else {
          return { ...h, style: { ...h.style, [field]: value } };
        }
      }
      return h;
    }));
  };

  const deleteHotspot = (id: string) => {
    setEditableHotspots(editableHotspots.filter(h => h.id !== id));
    if (selectedHotspot === id) {
      setSelectedHotspot(null);
    }
  };

  const handleSave = () => {
    onSave(editableHotspots);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hotspot Editor</CardTitle>
        <p className="text-sm text-muted-foreground">
          Click and drag on the image to create hotspots, or adjust existing ones below
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image with Hotspots */}
        <div
          ref={imageRef}
          className="relative w-full max-w-3xl mx-auto border-2 border-dashed rounded-lg overflow-hidden cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <img
            src={imageUrl}
            alt="Slide for hotspot editing"
            className="w-full h-auto"
            draggable={false}
          />
          
          {/* Render Hotspots */}
          {editableHotspots.map((hotspot) => (
            <div
              key={hotspot.id}
              className={`absolute border-2 rounded-md transition-all cursor-pointer ${
                selectedHotspot === hotspot.id
                  ? 'border-blue-500 bg-blue-500/30'
                  : 'border-red-500 bg-red-500/20'
              }`}
              style={{
                top: hotspot.style.top,
                left: hotspot.style.left,
                width: hotspot.style.width,
                height: hotspot.style.height,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedHotspot(hotspot.id);
              }}
            >
              <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs px-1 rounded-br">
                {hotspot.id}
              </div>
            </div>
          ))}
        </div>

        {/* Hotspot List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Hotspots ({editableHotspots.length})</h3>
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Hotspots
            </Button>
          </div>

          {editableHotspots.map((hotspot) => (
            <Card
              key={hotspot.id}
              className={`p-4 ${selectedHotspot === hotspot.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Hotspot: {hotspot.id}</Label>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteHotspot(hotspot.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <Label htmlFor={`id-${hotspot.id}`}>ID</Label>
                  <Input
                    id={`id-${hotspot.id}`}
                    value={hotspot.id}
                    onChange={(e) => updateHotspot(hotspot.id, 'id', e.target.value)}
                    placeholder="e.g., jargon, font, image"
                  />
                </div>

                <div>
                  <Label htmlFor={`feedback-${hotspot.id}`}>Feedback</Label>
                  <Input
                    id={`feedback-${hotspot.id}`}
                    value={hotspot.feedback}
                    onChange={(e) => updateHotspot(hotspot.id, 'feedback', e.target.value)}
                    placeholder="Feedback when hotspot is clicked"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`top-${hotspot.id}`}>Top (%)</Label>
                    <Input
                      id={`top-${hotspot.id}`}
                      value={hotspot.style.top}
                      onChange={(e) => updateHotspot(hotspot.id, 'top', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`left-${hotspot.id}`}>Left (%)</Label>
                    <Input
                      id={`left-${hotspot.id}`}
                      value={hotspot.style.left}
                      onChange={(e) => updateHotspot(hotspot.id, 'left', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`width-${hotspot.id}`}>Width (%)</Label>
                    <Input
                      id={`width-${hotspot.id}`}
                      value={hotspot.style.width}
                      onChange={(e) => updateHotspot(hotspot.id, 'width', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`height-${hotspot.id}`}>Height (%)</Label>
                    <Input
                      id={`height-${hotspot.id}`}
                      value={hotspot.style.height}
                      onChange={(e) => updateHotspot(hotspot.id, 'height', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {editableHotspots.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No hotspots yet. Click and drag on the image to create one.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
