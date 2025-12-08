import { useState } from "react";
import { Sparkles, X, GripVertical, Clock, Loader2, Check } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import api from "@/services/api";
import { toast } from "sonner";

interface BlockOutline {
    type: string;
    title: string;
    description: string;
    estimatedTime?: number;
    placeholderContent: any;
}

interface GenerateLessonOutlineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (data: {
        topic: string;
        objectives: string[];
        blockCount: number;
    }) => void;
    onAcceptOutline?: (blocks: BlockOutline[]) => void;
    courseId: string;
    moduleId: string;
    lessonId: string;
    courseTitle: string;
    moduleName: string;
    lessonName: string;
}

export function GenerateLessonOutlineModal({
    isOpen,
    onClose,
    onGenerate,
    onAcceptOutline,
    courseId,
    moduleId,
    lessonId,
    courseTitle,
    moduleName,
    lessonName,
}: GenerateLessonOutlineModalProps) {
    const [topic, setTopic] = useState("");
    const [objectivesText, setObjectivesText] = useState("");
    const [blockCount, setBlockCount] = useState(10);
    const [errors, setErrors] = useState<{ topic?: string; objectives?: string }>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedOutline, setGeneratedOutline] = useState<BlockOutline[] | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showAcceptance, setShowAcceptance] = useState(false);
    const [selectedBlockIndices, setSelectedBlockIndices] = useState<Set<number>>(new Set());

    const handleGenerate = async () => {
        // Validate inputs
        const newErrors: { topic?: string; objectives?: string } = {};

        if (!topic.trim()) {
            newErrors.topic = "Topic is required";
        }

        if (!objectivesText.trim()) {
            newErrors.objectives = "At least one learning objective is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Parse objectives (split by newlines)
        const objectives = objectivesText
            .split("\n")
            .map((obj) => obj.trim())
            .filter((obj) => obj.length > 0);

        if (objectives.length === 0) {
            setErrors({ objectives: "At least one learning objective is required" });
            return;
        }

        // Call API to generate outline
        setIsGenerating(true);
        try {
            const response = await api.post('/ai/generate-outline', {
                topic,
                objectives,
                blockCount,
                context: {
                    courseId,
                    courseTitle,
                    moduleId,
                    moduleName,
                    lessonId,
                    lessonName,
                },
            });

            const outline = response.data.outline;
            setGeneratedOutline(outline);
            setShowPreview(true);
            toast.success('Lesson outline generated successfully');
        } catch (error: any) {
            console.error('Failed to generate outline:', error);
            const errorMessage = error.response?.data?.message || 'Failed to generate outline. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleReorderBlocks = (result: DropResult) => {
        if (!generatedOutline) return;

        // Dropped outside the list
        if (!result.destination) {
            return;
        }

        // No movement
        if (result.destination.index === result.source.index) {
            return;
        }

        // Reorder blocks
        const reorderedBlocks = Array.from(generatedOutline);
        const [removed] = reorderedBlocks.splice(result.source.index, 1);
        reorderedBlocks.splice(result.destination.index, 0, removed);

        setGeneratedOutline(reorderedBlocks);
    };

    const handleBackToForm = () => {
        setShowPreview(false);
    };

    const handleNextToAcceptance = () => {
        console.log('[GenerateLessonOutline] Next button clicked');
        console.log('[GenerateLessonOutline] Generated outline:', generatedOutline);
        console.log('[GenerateLessonOutline] Current showPreview:', showPreview);
        console.log('[GenerateLessonOutline] Current showAcceptance:', showAcceptance);

        // Initialize all blocks as selected
        if (generatedOutline) {
            const allIndices = new Set(generatedOutline.map((_, index) => index));
            console.log('[GenerateLessonOutline] Setting selected indices:', allIndices);
            setSelectedBlockIndices(allIndices);
        }

        console.log('[GenerateLessonOutline] Setting showAcceptance to true');
        setShowPreview(false);
        setShowAcceptance(true);
    };

    const handleBackToPreview = () => {
        setShowAcceptance(false);
    };

    const handleToggleBlock = (index: number) => {
        setSelectedBlockIndices((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (generatedOutline) {
            setSelectedBlockIndices(new Set(generatedOutline.map((_, index) => index)));
        }
    };

    const handleDeselectAll = () => {
        setSelectedBlockIndices(new Set());
    };

    const handleAddSelectedBlocks = () => {
        if (!generatedOutline || selectedBlockIndices.size === 0) {
            toast.error('Please select at least one block to add');
            return;
        }

        const selectedBlocks = generatedOutline.filter((_, index) =>
            selectedBlockIndices.has(index)
        );

        if (onAcceptOutline) {
            onAcceptOutline(selectedBlocks);
        }

        // Reset and close
        setTopic("");
        setObjectivesText("");
        setBlockCount(10);
        setErrors({});
        setGeneratedOutline(null);
        setShowPreview(false);
        setShowAcceptance(false);
        setSelectedBlockIndices(new Set());
        onClose();
    };

    const handleClose = () => {
        setTopic("");
        setObjectivesText("");
        setBlockCount(10);
        setErrors({});
        setGeneratedOutline(null);
        setShowPreview(false);
        setShowAcceptance(false);
        setSelectedBlockIndices(new Set());
        onClose();
    };

    const getBlockTypeLabel = (type: string): string => {
        const labels: Record<string, string> = {
            text: 'Text',
            video: 'Video',
            code: 'Code',
            reflection: 'Reflection',
            poll: 'Poll',
            interactive: 'Interactive',
            list: 'List',
            image: 'Image',
            divider: 'Divider',
        };
        return labels[type] || type;
    };

    const getBlockTypeColor = (type: string): string => {
        const colors: Record<string, string> = {
            text: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
            video: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
            code: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
            reflection: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
            poll: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
            interactive: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
            list: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
            image: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
            divider: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
        };
        return colors[type] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        {showAcceptance
                            ? 'Select Blocks to Add'
                            : showPreview
                                ? 'Review Lesson Outline'
                                : 'Generate Lesson Outline with AI'}
                    </DialogTitle>
                    <DialogDescription>
                        {showAcceptance
                            ? 'Choose which blocks to add to your lesson. Selected blocks will be created with placeholder content.'
                            : showPreview
                                ? 'Review and reorder the generated blocks. You can accept them in the next step.'
                                : 'Create a complete lesson structure with AI-generated blocks. Provide a topic and learning objectives to get started.'}
                    </DialogDescription>
                </DialogHeader>

                {showAcceptance ? (
                    /* Acceptance Section */
                    <div className="space-y-4 py-4">
                        {/* Summary and Actions */}
                        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Select Blocks to Add</p>
                                <p className="text-xs text-muted-foreground">
                                    {selectedBlockIndices.size} of {generatedOutline?.length || 0} selected
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSelectAll}
                                    disabled={selectedBlockIndices.size === generatedOutline?.length}
                                >
                                    Select All
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDeselectAll}
                                    disabled={selectedBlockIndices.size === 0}
                                >
                                    Deselect All
                                </Button>
                            </div>
                        </div>

                        {/* Block List with Checkboxes */}
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {generatedOutline?.map((block, index) => (
                                <div
                                    key={`accept-${block.type}-${index}`}
                                    className={cn(
                                        "bg-background border rounded-lg p-4 transition-all cursor-pointer hover:border-primary/50",
                                        selectedBlockIndices.has(index) && "border-primary bg-primary/5"
                                    )}
                                    onClick={() => handleToggleBlock(index)}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Checkbox */}
                                        <Checkbox
                                            checked={selectedBlockIndices.has(index)}
                                            onCheckedChange={() => handleToggleBlock(index)}
                                            className="mt-1"
                                        />

                                        {/* Block Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={cn(
                                                            "text-xs font-medium px-2 py-1 rounded",
                                                            getBlockTypeColor(block.type)
                                                        )}
                                                    >
                                                        {getBlockTypeLabel(block.type)}
                                                    </span>
                                                    {block.estimatedTime && (
                                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            {block.estimatedTime} min
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <h4 className="font-medium text-sm mb-1">
                                                {block.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                {block.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                            <Button variant="outline" onClick={handleBackToPreview}>
                                ← Back to Preview
                            </Button>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleAddSelectedBlocks}
                                    disabled={selectedBlockIndices.size === 0}
                                    className="gap-2"
                                >
                                    <Check className="h-4 w-4" />
                                    Add {selectedBlockIndices.size} Block{selectedBlockIndices.size !== 1 ? 's' : ''}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : showPreview ? (
                    <div className="space-y-4 py-4">
                        {/* Summary */}
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Generated Outline</p>
                                <p className="text-xs text-muted-foreground">
                                    {generatedOutline?.length || 0} blocks • ~
                                    {generatedOutline?.reduce((sum, block) => sum + (block.estimatedTime || 5), 0) || 0} minutes
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Drag blocks to reorder them. You can accept or reject individual blocks in the next step.
                            </p>
                        </div>

                        {/* Block List with Drag and Drop */}
                        <DragDropContext onDragEnd={handleReorderBlocks}>
                            <Droppable droppableId="outline-blocks">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={cn(
                                            "space-y-2 min-h-[200px]",
                                            snapshot.isDraggingOver && "bg-accent/30 rounded-lg p-2"
                                        )}
                                    >
                                        {generatedOutline?.map((block, index) => (
                                            <Draggable
                                                key={`${block.type}-${index}`}
                                                draggableId={`${block.type}-${index}`}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={cn(
                                                            "bg-background border rounded-lg p-4 transition-all",
                                                            snapshot.isDragging && "shadow-lg ring-2 ring-primary/50"
                                                        )}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            {/* Drag Handle */}
                                                            <div
                                                                {...provided.dragHandleProps}
                                                                className="mt-1 cursor-grab active:cursor-grabbing"
                                                            >
                                                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                            </div>

                                                            {/* Block Content */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span
                                                                            className={cn(
                                                                                "text-xs font-medium px-2 py-1 rounded",
                                                                                getBlockTypeColor(block.type)
                                                                            )}
                                                                        >
                                                                            {getBlockTypeLabel(block.type)}
                                                                        </span>
                                                                        {block.estimatedTime && (
                                                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                                <Clock className="h-3 w-3" />
                                                                                {block.estimatedTime} min
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <h4 className="font-medium text-sm mb-1">
                                                                    {block.title}
                                                                </h4>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {block.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                            <Button variant="outline" onClick={handleBackToForm}>
                                ← Back to Form
                            </Button>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={(e) => {
                                        console.log('[Button] Next button clicked', e);
                                        handleNextToAcceptance();
                                    }}
                                    className="gap-2"
                                    type="button"
                                >
                                    Next: Select Blocks →
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Form Section */
                    <div className="space-y-6 py-4">
                        {/* Context Information */}
                        <div className="bg-muted/50 rounded-lg p-4 space-y-1">
                            <p className="text-sm font-medium">Context</p>
                            <p className="text-xs text-muted-foreground">
                                <span className="font-medium">Course:</span> {courseTitle}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                <span className="font-medium">Module:</span> {moduleName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                <span className="font-medium">Lesson:</span> {lessonName}
                            </p>
                        </div>

                        {/* Topic Input */}
                        <div className="space-y-2">
                            <Label htmlFor="topic">
                                Lesson Topic <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="topic"
                                placeholder="e.g., Introduction to Machine Learning"
                                value={topic}
                                onChange={(e) => {
                                    setTopic(e.target.value);
                                    if (errors.topic) {
                                        setErrors({ ...errors, topic: undefined });
                                    }
                                }}
                                className={errors.topic ? "border-destructive" : ""}
                            />
                            {errors.topic && (
                                <p className="text-xs text-destructive">{errors.topic}</p>
                            )}
                        </div>

                        {/* Learning Objectives Input */}
                        <div className="space-y-2">
                            <Label htmlFor="objectives">
                                Learning Objectives <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="objectives"
                                placeholder="Enter one objective per line, e.g.:&#10;- Understand the basics of machine learning&#10;- Identify different types of ML algorithms&#10;- Apply ML concepts to real-world problems"
                                value={objectivesText}
                                onChange={(e) => {
                                    setObjectivesText(e.target.value);
                                    if (errors.objectives) {
                                        setErrors({ ...errors, objectives: undefined });
                                    }
                                }}
                                rows={6}
                                className={errors.objectives ? "border-destructive" : ""}
                            />
                            {errors.objectives && (
                                <p className="text-xs text-destructive">{errors.objectives}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Enter one learning objective per line
                            </p>
                        </div>

                        {/* Block Count Input */}
                        <div className="space-y-2">
                            <Label htmlFor="blockCount">Number of Blocks</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    id="blockCount"
                                    type="number"
                                    min={4}
                                    max={20}
                                    value={blockCount}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (!isNaN(value) && value >= 4 && value <= 20) {
                                            setBlockCount(value);
                                        }
                                    }}
                                    className="w-24"
                                />
                                <input
                                    type="range"
                                    min={4}
                                    max={20}
                                    value={blockCount}
                                    onChange={(e) => setBlockCount(parseInt(e.target.value))}
                                    className="flex-1"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Recommended: 8-12 blocks (approximately {blockCount * 5} minutes of content)
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2">
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4" />
                                        Generate Outline
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
