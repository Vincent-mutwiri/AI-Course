import { useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Lesson {
    _id: string;
    title: string;
    duration?: number;
    blocks?: any[];
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

interface CourseStructureProps {
    course: Course;
    currentModuleId: string | null;
    currentLessonId: string | null;
    onLessonSelect: (moduleId: string, lessonId: string) => void;
    onAddModule?: () => void;
}

export default function CourseStructure({
    course,
    currentModuleId,
    currentLessonId,
    onLessonSelect,
    onAddModule,
}: CourseStructureProps) {
    // Track which modules are expanded in the accordion
    const [expandedModules, setExpandedModules] = useState<string[]>(
        currentModuleId ? [currentModuleId] : []
    );

    const handleLessonClick = (moduleId: string, lessonId: string) => {
        onLessonSelect(moduleId, lessonId);
    };

    return (
        <div className="flex flex-col h-full" role="navigation" aria-label="Course structure navigation">
            {/* Header */}
            <div className="p-4 border-b">
                <h2 className="font-semibold text-sm mb-1" id="course-structure-heading">Course Structure</h2>
                <p className="text-xs text-muted-foreground" aria-live="polite">
                    {course.modules.length} {course.modules.length === 1 ? "module" : "modules"}
                </p>
            </div>

            {/* Modules and Lessons */}
            <div className="flex-1 overflow-y-auto p-4">
                <Accordion
                    type="multiple"
                    value={expandedModules}
                    onValueChange={setExpandedModules}
                    className="space-y-2"
                >
                    {course.modules
                        .sort((a, b) => a.order - b.order)
                        .map((module) => (
                            <AccordionItem
                                key={module._id}
                                value={module._id}
                                className={cn(
                                    "border rounded-lg overflow-hidden",
                                    currentModuleId === module._id && "border-primary/50"
                                )}
                            >
                                <AccordionTrigger
                                    className="px-3 py-2 hover:no-underline hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                    aria-label={`${module.title}, ${module.lessons.length} ${module.lessons.length === 1 ? 'lesson' : 'lessons'}`}
                                >
                                    <div className="flex items-start gap-2 text-left flex-1">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">
                                                {module.title}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                {module.lessons.length}{" "}
                                                {module.lessons.length === 1 ? "lesson" : "lessons"}
                                            </div>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-0 pb-0">
                                    <nav className="space-y-0.5 px-2 pb-2" aria-label={`Lessons in ${module.title}`}>
                                        {module.lessons
                                            .sort((a, b) => (a.duration || 0) - (b.duration || 0))
                                            .map((lesson) => {
                                                const isActive =
                                                    currentModuleId === module._id &&
                                                    currentLessonId === lesson._id;
                                                const blockCount = lesson.blocks?.length || 0;

                                                return (
                                                    <button
                                                        key={lesson._id}
                                                        onClick={() =>
                                                            handleLessonClick(module._id, lesson._id)
                                                        }
                                                        className={cn(
                                                            "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                                                            "hover:bg-accent/70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                                                            isActive
                                                                ? "bg-primary text-primary-foreground font-medium"
                                                                : "text-foreground"
                                                        )}
                                                        aria-label={`${lesson.title}${blockCount > 0 ? `, ${blockCount} blocks` : ''}${isActive ? ', currently selected' : ''}`}
                                                        aria-current={isActive ? 'page' : undefined}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <ChevronRight
                                                                className={cn(
                                                                    "h-3 w-3 shrink-0 transition-opacity",
                                                                    isActive ? "opacity-100" : "opacity-0"
                                                                )}
                                                                aria-hidden="true"
                                                            />
                                                            <span className="truncate flex-1">
                                                                {lesson.title}
                                                            </span>
                                                            {blockCount > 0 && (
                                                                <span
                                                                    className={cn(
                                                                        "text-xs px-1.5 py-0.5 rounded",
                                                                        isActive
                                                                            ? "bg-primary-foreground/20"
                                                                            : "bg-muted"
                                                                    )}
                                                                    aria-label={`${blockCount} blocks`}
                                                                >
                                                                    {blockCount}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                    </nav>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                </Accordion>
            </div>

            {/* Add Module Button */}
            {onAddModule && (
                <div className="p-4 border-t">
                    <Button
                        onClick={onAddModule}
                        variant="outline"
                        size="sm"
                        className="w-full"
                        aria-label="Add new module to course"
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Add Module
                    </Button>
                </div>
            )}
        </div>
    );
}
