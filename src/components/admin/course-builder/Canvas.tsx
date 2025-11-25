import { useCallback, memo } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import BlockRenderer from "./BlockRenderer";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

interface Block {
    id: string;
    type: string;
    order: number;
    content: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

interface CanvasProps {
    blocks: Block[];
    onBlocksReorder: (blocks: Block[]) => void;
    onBlockEdit: (blockId: string) => void;
    onBlockDuplicate: (blockId: string) => void;
    onBlockDelete: (blockId: string) => void;
    onBlockPreview: (blockId: string) => void;
    isLoading?: boolean;
}

/**
 * Canvas Component - Optimized with useCallback for better performance
 */
const Canvas = memo(function Canvas({
    blocks,
    onBlocksReorder,
    onBlockEdit,
    onBlockDuplicate,
    onBlockDelete,
    onBlockPreview,
    isLoading = false,
}: CanvasProps) {
    const handleDragEnd = useCallback((result: DropResult) => {
        // Dropped outside the list
        if (!result.destination) {
            return;
        }

        // No movement
        if (result.destination.index === result.source.index) {
            return;
        }

        // Reorder blocks
        const reorderedBlocks = Array.from(blocks);
        const [removed] = reorderedBlocks.splice(result.source.index, 1);
        reorderedBlocks.splice(result.destination.index, 0, removed);

        // Update order property for each block
        const updatedBlocks = reorderedBlocks.map((block, index) => ({
            ...block,
            order: index,
        }));

        onBlocksReorder(updatedBlocks);
    }, [blocks, onBlocksReorder]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                    <p className="text-sm text-muted-foreground">Loading blocks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full">
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="canvas-blocks">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={cn(
                                "min-h-full p-6 transition-colors",
                                snapshot.isDraggingOver && "bg-accent/30"
                            )}
                        >
                            {blocks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                                    <div className="text-center space-y-2">
                                        <div className="text-muted-foreground/50 mb-2">
                                            <svg
                                                className="h-12 w-12 mx-auto"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            No blocks yet
                                        </p>
                                        <p className="text-xs text-muted-foreground/75">
                                            Add blocks from the library to get started
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {blocks
                                        .sort((a, b) => a.order - b.order)
                                        .map((block, index) => (
                                            <Draggable
                                                key={block.id}
                                                draggableId={block.id}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={cn(
                                                            "group relative transition-all",
                                                            snapshot.isDragging &&
                                                            "shadow-lg ring-2 ring-primary/50 rotate-2"
                                                        )}
                                                    >
                                                        {/* Drag Handle */}
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                                                        >
                                                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                        </div>

                                                        {/* Block Content using BlockRenderer */}
                                                        <div className="pl-10">
                                                            <ErrorBoundary>
                                                                <BlockRenderer
                                                                    block={block}
                                                                    onEdit={() => onBlockEdit(block.id)}
                                                                    onDuplicate={() => onBlockDuplicate(block.id)}
                                                                    onPreview={() => onBlockPreview(block.id)}
                                                                    onDelete={() => onBlockDelete(block.id)}
                                                                    isDragging={snapshot.isDragging}
                                                                />
                                                            </ErrorBoundary>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
});

export default Canvas;
