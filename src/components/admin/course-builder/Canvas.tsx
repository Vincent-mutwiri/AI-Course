import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function Canvas({
    blocks,
    onBlocksReorder,
    onBlockEdit,
    onBlockDuplicate,
    onBlockDelete,
    onBlockPreview,
    isLoading = false,
}: CanvasProps) {
    const handleDragEnd = (result: DropResult) => {
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
    };

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
                                                            "group relative bg-card border rounded-lg transition-all",
                                                            snapshot.isDragging &&
                                                            "shadow-lg ring-2 ring-primary/50 rotate-2"
                                                        )}
                                                    >
                                                        {/* Drag Handle */}
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                                                        >
                                                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                        </div>

                                                        {/* Block Content */}
                                                        <div className="pl-10 pr-4 py-4">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                                            {block.type}
                                                                        </span>
                                                                        <span className="text-xs text-muted-foreground/50">
                                                                            #{block.order + 1}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-sm text-foreground">
                                                                        {/* Block preview content will be rendered here */}
                                                                        <p className="text-muted-foreground">
                                                                            Block content preview
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Action Buttons */}
                                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() => onBlockEdit(block.id)}
                                                                        className="p-2 hover:bg-accent rounded-md transition-colors"
                                                                        title="Edit block"
                                                                    >
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
                                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => onBlockDuplicate(block.id)}
                                                                        className="p-2 hover:bg-accent rounded-md transition-colors"
                                                                        title="Duplicate block"
                                                                    >
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
                                                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => onBlockPreview(block.id)}
                                                                        className="p-2 hover:bg-accent rounded-md transition-colors"
                                                                        title="Preview block"
                                                                    >
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
                                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                            />
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => onBlockDelete(block.id)}
                                                                        className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                                                                        title="Delete block"
                                                                    >
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
                                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
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
}
