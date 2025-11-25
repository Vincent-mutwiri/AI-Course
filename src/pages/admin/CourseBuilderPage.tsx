import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, useBeforeUnload } from "react-router-dom";
import { toast } from "sonner";
import { Eye, Menu, X, Library, FileText } from "lucide-react";
import api from "@/services/api";
import { debounce } from "@/utils/debounce";
import { useBlockModal } from "@/hooks/useBlockModal";
import CourseStructure from "@/components/admin/course-builder/CourseStructure";
import Canvas from "@/components/admin/course-builder/Canvas";
import BlockLibrary from "@/components/admin/course-builder/BlockLibrary";
import PreviewModal from "@/components/admin/course-builder/PreviewModal";
import { BlockModalRouter } from "@/components/admin/course-builder/BlockModalRouter";
import { Button } from "@/components/ui/button";
import type { BlockType } from "@/hooks/useBlockModal";

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
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [saveRetryCount, setSaveRetryCount] = useState(0);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [isStructureOpen, setIsStructureOpen] = useState(false);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [isMobileWarningDismissed, setIsMobileWarningDismissed] = useState(false);

    // Initialize block modal management
    const { modalState, openModal, closeModal, handleSave } = useBlockModal({
        blocks,
        onBlocksChange: (updatedBlocks) => {
            setBlocks(updatedBlocks);
            setHasUnsavedChanges(true);
        },
    });

    // Fetch course data on mount
    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) {
                setLoadError("Course ID is required");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setLoadError(null);
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
                const errorMessage = error.response?.data?.message || "Failed to load course. Please try again.";
                setLoadError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [id, navigate]);

    // Retry loading course
    const handleRetryLoad = () => {
        setIsLoading(true);
        setLoadError(null);
        window.location.reload();
    };

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

            // Calculate lesson index for preview
            const lessonIndex = module?.lessons.findIndex((l) => l._id === lessonId) ?? 0;
            setCurrentLessonIndex(lessonIndex);
        }
    };

    // Handle add module
    const handleAddModule = () => {
        toast.info("Add module functionality will be implemented in a future task");
    };

    // Handle blocks reorder - memoized for performance
    const handleBlocksReorder = useCallback(async (reorderedBlocks: Block[]) => {
        // Update local state immediately for optimistic UI
        const previousBlocks = [...blocks];
        setBlocks(reorderedBlocks);
        setHasUnsavedChanges(true);

        // Persist to backend
        if (!currentLessonId) return;

        try {
            const blockIds = reorderedBlocks.map((block) => block.id);
            await api.patch(
                `/admin/courses/${id}/lessons/${currentLessonId}/blocks/reorder`,
                { blockIds }
            );
            toast.success("Blocks reordered");
        } catch (error: any) {
            console.error("Failed to reorder blocks:", error);
            // Rollback on error
            setBlocks(previousBlocks);
            const errorMessage = error.response?.data?.message || "Failed to reorder blocks. Changes have been reverted.";
            toast.error(errorMessage);
        }
    }, [blocks, currentLessonId, id]);

    // Handle block edit - memoized for performance
    const handleBlockEdit = useCallback((blockId: string) => {
        const block = blocks.find((b) => b.id === blockId);
        if (block) {
            openModal(block.type, block);
        }
    }, [blocks, openModal]);

    // Handle block duplicate - memoized for performance
    const handleBlockDuplicate = useCallback(async (blockId: string) => {
        if (!currentLessonId) {
            toast.error("No lesson selected");
            return;
        }

        try {
            const response = await api.post(
                `/admin/courses/${id}/lessons/${currentLessonId}/blocks/${blockId}/duplicate`
            );
            const newBlock = response.data.block;

            // Add the duplicated block to the local state
            const blockIndex = blocks.findIndex((b) => b.id === blockId);
            const updatedBlocks = [...blocks];
            updatedBlocks.splice(blockIndex + 1, 0, newBlock);

            // Update order for all blocks
            const reorderedBlocks = updatedBlocks.map((block, index) => ({
                ...block,
                order: index,
            }));

            setBlocks(reorderedBlocks);
            setHasUnsavedChanges(true);
            toast.success("Block duplicated successfully");
        } catch (error: any) {
            console.error("Failed to duplicate block:", error);
            const errorMessage = error.response?.data?.message || "Failed to duplicate block. Please try again.";
            toast.error(errorMessage);
        }
    }, [blocks, currentLessonId, id]);

    // Handle block delete - memoized for performance
    const handleBlockDelete = useCallback((blockId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this block? This action cannot be undone."
        );

        if (!confirmed) return;

        // Remove block from local state
        const updatedBlocks = blocks
            .filter((block) => block.id !== blockId)
            .map((block, index) => ({
                ...block,
                order: index,
            }));

        setBlocks(updatedBlocks);
        setHasUnsavedChanges(true);
        toast.success("Block deleted");
    }, [blocks]);

    // Handle block preview - opens preview modal for entire lesson - memoized for performance
    const handleBlockPreview = useCallback((blockId: string) => {
        setIsPreviewOpen(true);
    }, []);

    // Handle block add from library - memoized for performance
    const handleBlockAdd = useCallback((blockType: string) => {
        // Open modal for the selected block type to configure it
        openModal(blockType as BlockType);
    }, [openModal]);

    // Handle preview toggle
    const handlePreviewToggle = () => {
        setIsPreviewOpen(!isPreviewOpen);
    };

    // Get current lesson for preview
    const getCurrentLesson = () => {
        if (!currentModuleId || !currentLessonId || !course) return null;

        const module = course.modules.find((m) => m._id === currentModuleId);
        const lesson = module?.lessons.find((l) => l._id === currentLessonId);

        if (!lesson) return null;

        // Return lesson with current blocks state (including unsaved changes)
        return {
            ...lesson,
            blocks: blocks,
        };
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

    if (loadError) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center max-w-md">
                    <div className="mb-4 text-destructive">
                        <svg
                            className="h-16 w-16 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Failed to Load Course</h2>
                    <p className="text-muted-foreground mb-6">{loadError}</p>
                    <div className="flex gap-3 justify-center">
                        <Button onClick={handleRetryLoad} variant="default">
                            Retry
                        </Button>
                        <Button onClick={() => navigate("/admin")} variant="outline">
                            Return to Admin
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-lg font-semibold mb-2">Course not found</p>
                    <Button onClick={() => navigate("/admin")} variant="outline">
                        Return to Admin Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Mobile Warning */}
            {!isMobileWarningDismissed && (
                <div className="lg:hidden bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                Limited Mobile Support
                            </p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                The course builder is optimized for tablet and desktop. Some features may be limited on smaller screens.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsMobileWarningDismissed(true)}
                            className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
                            aria-label="Dismiss warning"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="border-b bg-background px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Mobile menu buttons */}
                    <div className="flex items-center gap-1 lg:hidden">
                        <button
                            onClick={() => setIsStructureOpen(!isStructureOpen)}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                            aria-label="Toggle course structure"
                        >
                            <FileText className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                            aria-label="Toggle block library"
                        >
                            <Library className="h-5 w-5" />
                        </button>
                    </div>

                    <button
                        onClick={handleBackClick}
                        className="text-muted-foreground hover:text-foreground text-sm md:text-base"
                    >
                        ← Back
                    </button>
                    <div className="hidden sm:block">
                        <h1 className="text-lg md:text-xl font-semibold truncate max-w-[200px] md:max-w-none">
                            {course.title}
                        </h1>
                        <p className="text-xs md:text-sm text-muted-foreground">Course Builder</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                    {isSaving && (
                        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                            <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-primary"></div>
                            <span className="hidden sm:inline">Saving...</span>
                        </div>
                    )}
                    {!isSaving && !hasUnsavedChanges && (
                        <div className="flex items-center gap-2 text-xs md:text-sm text-green-600">
                            <svg
                                className="h-3 w-3 md:h-4 md:w-4"
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
                            <span className="hidden sm:inline">Saved</span>
                        </div>
                    )}
                    {currentLessonId && (
                        <Button
                            onClick={handlePreviewToggle}
                            variant="outline"
                            size="sm"
                            className="gap-1 md:gap-2 text-xs md:text-sm"
                        >
                            <Eye className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="hidden sm:inline">Preview</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Three-panel layout */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Panel - Course Structure */}
                <div
                    className={`
                        ${isStructureOpen ? 'translate-x-0' : '-translate-x-full'}
                        lg:translate-x-0
                        fixed lg:static
                        inset-y-0 left-0
                        w-64 md:w-72 lg:w-64
                        border-r bg-background lg:bg-muted/30
                        overflow-y-auto
                        z-30
                        transition-transform duration-300 ease-in-out
                        top-[57px] md:top-[65px]
                    `}
                >
                    <div className="lg:hidden flex items-center justify-between p-4 border-b">
                        <h2 className="font-semibold">Course Structure</h2>
                        <button
                            onClick={() => setIsStructureOpen(false)}
                            className="p-1 hover:bg-muted rounded"
                            aria-label="Close course structure"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <CourseStructure
                        course={course}
                        currentModuleId={currentModuleId}
                        currentLessonId={currentLessonId}
                        onLessonSelect={(moduleId, lessonId) => {
                            handleLessonSelect(moduleId, lessonId);
                            setIsStructureOpen(false);
                        }}
                        onAddModule={handleAddModule}
                    />
                </div>

                {/* Overlay for mobile sidebars */}
                {(isStructureOpen || isLibraryOpen) && (
                    <div
                        className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                        onClick={() => {
                            setIsStructureOpen(false);
                            setIsLibraryOpen(false);
                        }}
                        aria-hidden="true"
                    />
                )}

                {/* Center Panel - Canvas */}
                <div className="flex-1 overflow-y-auto bg-background">
                    {currentLessonId ? (
                        <Canvas
                            blocks={blocks}
                            onBlocksReorder={handleBlocksReorder}
                            onBlockEdit={handleBlockEdit}
                            onBlockDuplicate={handleBlockDuplicate}
                            onBlockDelete={handleBlockDelete}
                            onBlockPreview={handleBlockPreview}
                            isLoading={isLoading}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full p-4">
                            <div className="text-center">
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Select a lesson to start editing
                                </p>
                                <button
                                    onClick={() => setIsStructureOpen(true)}
                                    className="mt-4 lg:hidden text-primary hover:underline text-sm"
                                >
                                    Open Course Structure
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel - Block Library */}
                <div
                    className={`
                        ${isLibraryOpen ? 'translate-x-0' : 'translate-x-full'}
                        lg:translate-x-0
                        fixed lg:static
                        inset-y-0 right-0
                        w-80 md:w-96 lg:w-80
                        border-l bg-background lg:bg-muted/30
                        overflow-y-auto
                        z-30
                        transition-transform duration-300 ease-in-out
                        top-[57px] md:top-[65px]
                    `}
                >
                    <div className="lg:hidden flex items-center justify-between p-4 border-b">
                        <h2 className="font-semibold">Block Library</h2>
                        <button
                            onClick={() => setIsLibraryOpen(false)}
                            className="p-1 hover:bg-muted rounded"
                            aria-label="Close block library"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <BlockLibrary
                        onBlockAdd={(blockType) => {
                            handleBlockAdd(blockType);
                            setIsLibraryOpen(false);
                        }}
                    />
                </div>
            </div>

            {/* Preview Modal */}
            <PreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                lesson={getCurrentLesson()}
                courseId={id}
                moduleId={currentModuleId || undefined}
                lessonIndex={currentLessonIndex}
            />

            {/* Block Configuration Modals */}
            <BlockModalRouter
                modalState={modalState}
                onClose={closeModal}
                onSave={handleSave}
            />
        </div>
    );
}
