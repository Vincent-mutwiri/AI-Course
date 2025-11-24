import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useBeforeUnload } from "react-router-dom";
import { toast } from "sonner";
import api from "@/services/api";
import { debounce } from "@/utils/debounce";
import CourseStructure from "@/components/admin/course-builder/CourseStructure";

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
    blocks?: Block[];
}

interface Module {
    _id: string;
    title: string;
    description?: string;
    lessons: Lesson[];
    order: number;
}

interface Course {
    _id: string;
    title: string;
    modules: Module[];
}

export default function CourseBuilderPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Component state
    const [course, setCourse] = useState<Course | null>(null);
    const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
    const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [saveRetryCount, setSaveRetryCount] = useState(0);

    // Fetch course data on mount
    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) {
                toast.error("Course ID is required");
                navigate("/admin");
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get(`/admin/courses/${id}/edit`);
                const courseData = response.data.course;

                setCourse(courseData);

                // Set initial module and lesson if available
                if (courseData.modules?.length > 0) {
                    const firstModule = courseData.modules[0];
                    setCurrentModuleId(firstModule._id);

                    if (firstModule.lessons?.length > 0) {
                        const firstLesson = firstModule.lessons[0];
                        setCurrentLessonId(firstLesson._id);
                        setBlocks(firstLesson.blocks || []);
                    }
                }
            } catch (error: any) {
                console.error("Failed to fetch course:", error);
                toast.error(error.response?.data?.message || "Failed to load course");
                navigate("/admin");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [id, navigate]);

    // Auto-save functionality with debounce
    const saveBlocks = async (blocksToSave: Block[], retryCount = 0) => {
        if (!currentModuleId || !currentLessonId) return;

        try {
            setIsSaving(true);
            await api.put(
                `/admin/courses/${id}/modules/${currentModuleId}/lessons/${currentLessonId}/blocks`,
                { blocks: blocksToSave }
            );
            setHasUnsavedChanges(false);
            setSaveRetryCount(0);
            toast.success("Changes saved");
        } catch (error: any) {
            console.error("Failed to save blocks:", error);

            // Retry logic - retry up to 3 times with exponential backoff
            if (retryCount < 3) {
                const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
                toast.warning(`Save failed. Retrying in ${delay / 1000}s...`);
                setSaveRetryCount(retryCount + 1);

                setTimeout(() => {
                    saveBlocks(blocksToSave, retryCount + 1);
                }, delay);
            } else {
                toast.error(error.response?.data?.message || "Failed to save changes after multiple attempts");
                setSaveRetryCount(0);
            }
        } finally {
            if (retryCount === 0) {
                setIsSaving(false);
            }
        }
    };

    const debouncedSave = debounce(saveBlocks, 2000);

    // Trigger auto-save when blocks change
    useEffect(() => {
        if (!isLoading && hasUnsavedChanges) {
            debouncedSave(blocks);
        }
    }, [blocks, hasUnsavedChanges, isLoading]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd/Ctrl+Z for undo
            if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                handleUndo();
            }

            // Cmd/Ctrl+D for duplicate
            if ((e.metaKey || e.ctrlKey) && e.key === "d") {
                e.preventDefault();
                handleDuplicate();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [blocks]);

    // Undo handler - to be connected with block operations
    const handleUndo = () => {
        // TODO: Implement undo logic with history stack
        toast.info("Undo functionality will be connected when block operations are implemented");
    };

    // Duplicate handler - to be connected with selected block
    const handleDuplicate = () => {
        // TODO: Implement duplicate logic for selected block
        toast.info("Duplicate functionality will be connected when block selection is implemented");
    };

    // Warn about unsaved changes on page unload
    useBeforeUnload(
        useCallback(
            (e) => {
                if (hasUnsavedChanges) {
                    e.preventDefault();
                    return (e.returnValue = "You have unsaved changes. Are you sure you want to leave?");
                }
            },
            [hasUnsavedChanges]
        )
    );

    // Custom navigation handler with confirmation
    const handleNavigateAway = useCallback(() => {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm(
                "You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
            );
            return confirmed;
        }
        return true;
    }, [hasUnsavedChanges]);

    // Override the back button to check for unsaved changes
    const handleBackClick = () => {
        if (handleNavigateAway()) {
            navigate("/admin");
        }
    };

    // Handle lesson selection
    const handleLessonSelect = (moduleId: string, lessonId: string) => {
        // Check for unsaved changes before switching lessons
        if (hasUnsavedChanges) {
            const confirmed = window.confirm(
                "You have unsaved changes. Are you sure you want to switch lessons? Your changes will be lost."
            );
            if (!confirmed) {
                return;
            }
        }

        // Find the selected lesson and load its blocks
        const module = course?.modules.find((m) => m._id === moduleId);
        const lesson = module?.lessons.find((l) => l._id === lessonId);

        if (lesson) {
            setCurrentModuleId(moduleId);
            setCurrentLessonId(lessonId);
            setBlocks(lesson.blocks || []);
            setHasUnsavedChanges(false);
        }
    };

    // Handle add module
    const handleAddModule = () => {
        toast.info("Add module functionality will be implemented in a future task");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading course builder...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-lg font-semibold mb-2">Course not found</p>
                    <button
                        onClick={() => navigate("/admin")}
                        className="text-primary hover:underline"
                    >
                        Return to admin dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="border-b bg-background px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBackClick}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        ← Back
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold">{course.title}</h1>
                        <p className="text-sm text-muted-foreground">Course Builder</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isSaving && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span>Saving...</span>
                        </div>
                    )}
                    {!isSaving && !hasUnsavedChanges && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <span>All changes saved</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Three-panel layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Course Structure */}
                <div className="w-64 border-r bg-muted/30 overflow-y-auto">
                    <CourseStructure
                        course={course}
                        currentModuleId={currentModuleId}
                        currentLessonId={currentLessonId}
                        onLessonSelect={handleLessonSelect}
                        onAddModule={handleAddModule}
                    />
                </div>

                {/* Center Panel - Canvas */}
                <div className="flex-1 overflow-y-auto bg-background">
                    <div className="p-6">
                        <h2 className="font-semibold mb-4">Canvas</h2>
                        <p className="text-sm text-muted-foreground">
                            Canvas panel coming soon
                        </p>
                        {blocks.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm">Loaded {blocks.length} blocks</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Block Library */}
                <div className="w-80 border-l bg-muted/30 overflow-y-auto">
                    <div className="p-4">
                        <h2 className="font-semibold mb-4">Block Library</h2>
                        <p className="text-sm text-muted-foreground">
                            Block library coming soon
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
