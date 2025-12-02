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
import { AddModuleModal } from "@/components/admin/course-builder/AddModuleModal";
import { AddLessonModal } from "@/components/admin/course-builder/AddLessonModal";
import { DeleteConfirmationDialog } from "@/components/admin/course-builder/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import type { BlockType, Block } from "@/hooks/useBlockModal";

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
    const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
    const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
    const [selectedModuleForLesson, setSelectedModuleForLesson] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [blockToDelete, setBlockToDelete] = useState<Block | null>(null);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [selectedBlockIds, setSelectedBlockIds] = useState<Set<string>>(new Set());

    // Initialize block modal management
    const { modalState, openModal, closeModal, handleSave } = useBlockModal({
        blocks,
        onBlocksChange: (updatedBlocks) => {
            console.log('[CourseBuilderPage] onBlocksChange called', { oldLength: blocks.length, newLength: updatedBlocks.length, updatedBlocks });
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
            // Ignore keyboard shortcuts when typing in input fields
            const target = e.target as HTMLElement;
            const isInputField = target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable;

            // Cmd/Ctrl+Z for undo
            if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey && !isInputField) {
                e.preventDefault();
                handleUndo();
            }

            // Cmd/Ctrl+D for duplicate
            if ((e.metaKey || e.ctrlKey) && e.key === "d" && !isInputField) {
                e.preventDefault();
                handleDuplicate();
            }

            // Delete/Backspace for deletion
            if ((e.key === "Delete" || e.key === "Backspace") && !isInputField && selectedBlockId) {
                e.preventDefault();
                handleBlockDelete(selectedBlockId);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [blocks, selectedBlockId]);

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
            setSelectedBlockId(null); // Clear selection when switching lessons
            setSelectedBlockIds(new Set()); // Clear multi-selection when switching lessons

            // Calculate lesson index for preview
            const lessonIndex = module?.lessons.findIndex((l) => l._id === lessonId) ?? 0;
            setCurrentLessonIndex(lessonIndex);
        }
    };

    // Handle add module
    const handleAddModule = () => {
        setIsAddModuleModalOpen(true);
    };

    // Handle save new module
    const handleSaveModule = async (data: { title: string; description?: string }) => {
        try {
            const response = await api.post(`/admin/courses/${id}/modules`, data);
            const newModule = response.data.module;

            // Update course state with new module
            setCourse((prevCourse) => {
                if (!prevCourse) return prevCourse;
                return {
                    ...prevCourse,
                    modules: [...prevCourse.modules, newModule],
                };
            });

            toast.success("Module created successfully");
        } catch (error: any) {
            console.error("Failed to create module:", error);
            toast.error(error.response?.data?.message || "Failed to create module");
            throw error;
        }
    };

    // Handle add lesson
    const handleAddLesson = (moduleId: string) => {
        setSelectedModuleForLesson(moduleId);
        setIsAddLessonModalOpen(true);
    };

    // Handle save new lesson
    const handleSaveLesson = async (data: { title: string; description?: string; duration?: number }) => {
        if (!selectedModuleForLesson) return;

        try {
            const response = await api.post(
                `/admin/courses/${id}/modules/${selectedModuleForLesson}/lessons`,
                data
            );
            const newLesson = response.data.lesson;

            // Update course state with new lesson
            setCourse((prevCourse) => {
                if (!prevCourse) return prevCourse;
                return {
                    ...prevCourse,
                    modules: prevCourse.modules.map((module) => {
                        if (module._id === selectedModuleForLesson) {
                            return {
                                ...module,
                                lessons: [...module.lessons, newLesson],
                            };
                        }
                        return module;
                    }),
                };
            });

            toast.success("Lesson created successfully");

            // Automatically select the new lesson
            setCurrentModuleId(selectedModuleForLesson);
            setCurrentLessonId(newLesson._id);
            setBlocks([]);
            setHasUnsavedChanges(false);
        } catch (error: any) {
            console.error("Failed to create lesson:", error);
            toast.error(error.response?.data?.message || "Failed to create lesson");
            throw error;
        }
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
        const block = blocks.find((b) => b.id === blockId);
        if (block) {
            setBlockToDelete(block);
            setIsDeleteDialogOpen(true);
        }
    }, [blocks]);

    // Confirm block deletion
    const handleConfirmDelete = useCallback(() => {
        if (!blockToDelete && selectedBlockIds.size === 0) return;

        if (selectedBlockIds.size > 0) {
            // Bulk delete
            const updatedBlocks = blocks
                .filter((block) => !selectedBlockIds.has(block.id))
                .map((block, index) => ({
                    ...block,
                    order: index,
                }));

            setBlocks(updatedBlocks);
            setHasUnsavedChanges(true);
            toast.success(`${selectedBlockIds.size} block${selectedBlockIds.size !== 1 ? "s" : ""} deleted`);
            setSelectedBlockIds(new Set());
        } else if (blockToDelete) {
            // Single delete
            const updatedBlocks = blocks
                .filter((block) => block.id !== blockToDelete.id)
                .map((block, index) => ({
                    ...block,
                    order: index,
                }));

            setBlocks(updatedBlocks);
            setHasUnsavedChanges(true);
            toast.success("Block deleted");
        }

        // Reset delete state
        setBlockToDelete(null);
        setIsDeleteDialogOpen(false);
    }, [blocks, blockToDelete, selectedBlockIds]);

    // Handle block preview - opens preview modal for entire lesson - memoized for performance
    const handleBlockPreview = useCallback((blockId: string) => {
        setIsPreviewOpen(true);
    }, []);

    // Handle block add from library - memoized for performance
    const handleBlockAdd = useCallback((blockType: string) => {
        // Open modal for the selected block type to configure it
        openModal(blockType as BlockType);
    }, [openModal]);

    // Handle block selection - memoized for performance
    const handleBlockSelect = useCallback((blockId: string | null, isMultiSelect: boolean = false) => {
        if (!blockId) {
            setSelectedBlockId(null);
            setSelectedBlockIds(new Set());
            return;
        }

        if (isMultiSelect) {
            // Multi-select mode (Cmd/Ctrl+Click)
            setSelectedBlockIds((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(blockId)) {
                    newSet.delete(blockId);
                } else {
                    newSet.add(blockId);
                }
                return newSet;
            });
            setSelectedBlockId(null); // Clear single selection in multi-select mode
        } else {
            // Single select mode
            setSelectedBlockId(blockId);
            setSelectedBlockIds(new Set()); // Clear multi-selection
        }
    }, []);

    // Handle bulk delete - memoized for performance
    const handleBulkDelete = useCallback(() => {
        if (selectedBlockIds.size === 0) return;

        // Set up for bulk deletion
        setIsDeleteDialogOpen(true);
    }, [selectedBlockIds]);

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
            {/* Skip to main content link for keyboard navigation */}
            <a
                href="#main-canvas"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
                Skip to main content
            </a>

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
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            aria-label={isStructureOpen ? "Close course structure" : "Open course structure"}
                            aria-expanded={isStructureOpen}
                            aria-controls="course-structure-panel"
                        >
                            <FileText className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                            onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            aria-label={isLibraryOpen ? "Close block library" : "Open block library"}
                            aria-expanded={isLibraryOpen}
                            aria-controls="block-library-panel"
                        >
                            <Library className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>

                    <button
                        onClick={handleBackClick}
                        className="text-muted-foreground hover:text-foreground text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
                        aria-label="Return to admin dashboard"
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
                        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground" role="status" aria-live="polite">
                            <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-primary" aria-hidden="true"></div>
                            <span className="hidden sm:inline">Saving...</span>
                            <span className="sr-only">Saving changes</span>
                        </div>
                    )}
                    {!isSaving && !hasUnsavedChanges && (
                        <div className="flex items-center gap-2 text-xs md:text-sm text-green-600" role="status" aria-live="polite">
                            <svg
                                className="h-3 w-3 md:h-4 md:w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <span className="hidden sm:inline">Saved</span>
                            <span className="sr-only">All changes saved</span>
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
                    id="course-structure-panel"
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
                    aria-hidden={!isStructureOpen && window.innerWidth < 1024}
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
                        onAddLesson={handleAddLesson}
                        onDeleteModule={async (moduleId) => {
                            if (!confirm("Are you sure you want to delete this module? All lessons within it will be deleted.")) return;
                            try {
                                await api.delete(`/admin/courses/${id}/modules/${moduleId}`);
                                setCourse((prev) => {
                                    if (!prev) return null;
                                    return {
                                        ...prev,
                                        modules: prev.modules.filter((m) => m._id !== moduleId),
                                    };
                                });
                                toast.success("Module deleted successfully");
                                // If current module is deleted, reset selection
                                if (currentModuleId === moduleId) {
                                    setCurrentModuleId(null);
                                    setCurrentLessonId(null);
                                    setBlocks([]);
                                }
                            } catch (error) {
                                console.error("Failed to delete module:", error);
                                toast.error("Failed to delete module");
                            }
                        }}
                        onDeleteLesson={async (moduleId, lessonId) => {
                            if (!confirm("Are you sure you want to delete this lesson?")) return;
                            try {
                                await api.delete(`/admin/courses/${id}/modules/${moduleId}/lessons/${lessonId}`);
                                setCourse((prev) => {
                                    if (!prev) return null;
                                    return {
                                        ...prev,
                                        modules: prev.modules.map((m) => {
                                            if (m._id === moduleId) {
                                                return {
                                                    ...m,
                                                    lessons: m.lessons.filter((l) => l._id !== lessonId),
                                                };
                                            }
                                            return m;
                                        }),
                                    };
                                });
                                toast.success("Lesson deleted successfully");
                                // If current lesson is deleted, reset selection
                                if (currentLessonId === lessonId) {
                                    setCurrentLessonId(null);
                                    setBlocks([]);
                                }
                            } catch (error) {
                                console.error("Failed to delete lesson:", error);
                                toast.error("Failed to delete lesson");
                            }
                        }}
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
                <div id="main-canvas" className="flex-1 overflow-y-auto bg-background">
                    {currentLessonId ? (
                        <Canvas
                            blocks={blocks}
                            onBlocksReorder={handleBlocksReorder}
                            onBlockEdit={handleBlockEdit}
                            onBlockDuplicate={handleBlockDuplicate}
                            onBlockDelete={handleBlockDelete}
                            onBlockPreview={handleBlockPreview}
                            selectedBlockId={selectedBlockId}
                            selectedBlockIds={selectedBlockIds}
                            onBlockSelect={handleBlockSelect}
                            onBulkDelete={handleBulkDelete}
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
                    id="block-library-panel"
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
                    aria-hidden={!isLibraryOpen && window.innerWidth < 1024}
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
                courseTitle={course?.title}
            />

            {/* Block Configuration Modals */}
            <BlockModalRouter
                modalState={modalState}
                onClose={closeModal}
                onSave={handleSave}
            />

            {/* Add Module Modal */}
            <AddModuleModal
                open={isAddModuleModalOpen}
                onClose={() => setIsAddModuleModalOpen(false)}
                onSave={handleSaveModule}
            />

            {/* Add Lesson Modal */}
            <AddLessonModal
                open={isAddLessonModalOpen}
                onClose={() => {
                    setIsAddLessonModalOpen(false);
                    setSelectedModuleForLesson(null);
                }}
                onSave={handleSaveLesson}
                moduleName={
                    selectedModuleForLesson
                        ? course?.modules.find((m) => m._id === selectedModuleForLesson)?.title
                        : undefined
                }
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setBlockToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                block={blockToDelete}
                blockCount={selectedBlockIds.size > 0 ? selectedBlockIds.size : 1}
            />
        </div>
    );
}
