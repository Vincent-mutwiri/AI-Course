import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BlockRenderer } from "@/components/modules/BlockRenderer";
import { useAuth } from "@/context/AuthContext";

interface Block {
    id: string;
    type: string;
    order: number;
    content: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

interface Lesson {
    _id: string;
    title: string;
    duration?: number;
    objective?: string;
    blocks?: Block[];
}

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    lesson: Lesson | null;
    courseId?: string;
    moduleId?: string;
    lessonIndex?: number;
    courseTitle?: string;
}

export default function PreviewModal({
    isOpen,
    onClose,
    lesson,
    courseId,
    moduleId,
    lessonIndex,
    courseTitle,
}: PreviewModalProps) {
    const { user } = useAuth();

    if (!lesson) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <DialogTitle className="text-2xl">{lesson.title}</DialogTitle>
                            {lesson.objective && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    <span className="font-semibold">Objective:</span> {lesson.objective}
                                </p>
                            )}
                            {lesson.duration && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Duration: {lesson.duration} minutes
                                </p>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="flex-shrink-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                {/* Preview Content */}
                <div className="flex-1 overflow-y-auto mt-4 pr-2">
                    {lesson.blocks && lesson.blocks.length > 0 ? (
                        <BlockRenderer
                            blocks={lesson.blocks}
                            userName={user?.name || "Learner"}
                            courseId={courseId}
                            moduleId={moduleId}
                            lessonIndex={lessonIndex}
                            courseTitle={courseTitle}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                            <div className="text-center space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    No blocks to preview
                                </p>
                                <p className="text-xs text-muted-foreground/75">
                                    Add blocks to see how they will appear to students
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t mt-4">
                    <div className="text-sm text-muted-foreground">
                        Preview Mode - This is how students will see this lesson
                    </div>
                    <Button onClick={onClose} variant="outline">
                        Exit Preview
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
