import React, { useState, useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { IBlock, BlockType } from '../../../types/page';
import { validateBlocks } from '../../../utils/blockValidation';
import SortableBlockItem from './SortableBlockItem';

interface BlockCanvasProps {
    blocks: IBlock[];
    onBlocksChange: (blocks: IBlock[]) => void;
    onReorderBlocks: (blockIds: string[]) => Promise<void>;
    onDuplicateBlock: (blockId: string) => Promise<void>;
    onDeleteBlock: (blockId: string) => Promise<void>;
    onBlockSelect?: (blockId: string | null) => void;
    selectedBlockId?: string | null;
}

const BlockCanvas: React.FC<BlockCanvasProps> = ({
    blocks,
    onBlocksChange,
    onReorderBlocks,
    onDuplicateBlock,
    onDeleteBlock,
    onBlockSelect,
    selectedBlockId,
}) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isDraggingFromPalette, setIsDraggingFromPalette] = useState(false);

    // Validate all blocks
    const blockValidationResults = useMemo(() => {
        return validateBlocks(blocks);
    }, [blocks]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        if (active.id !== over.id) {
            const oldIndex = blocks.findIndex((block) => block.id === active.id);
            const newIndex = blocks.findIndex((block) => block.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newBlocks = arrayMove(blocks, oldIndex, newIndex);

                // Update order property for all blocks
                const reorderedBlocks = newBlocks.map((block, index) => ({
                    ...block,
                    order: index,
                }));

                onBlocksChange(reorderedBlocks);

                // Call API to persist the reorder
                try {
                    await onReorderBlocks(reorderedBlocks.map(b => b.id));
                } catch (error) {
                    console.error('Failed to reorder blocks:', error);
                    // Revert on error
                    onBlocksChange(blocks);
                }
            }
        }

        setActiveId(null);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    // Handle drop from palette
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const blockType = e.dataTransfer.getData('blockType') as BlockType;

        if (blockType) {
            // This will be handled by the parent component
            // The parent should add the block at the appropriate position
            console.log('Block dropped from palette:', blockType);
        }

        setIsDraggingFromPalette(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        // Check if dragging from palette
        if (e.dataTransfer.types.includes('blocktype')) {
            setIsDraggingFromPalette(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        // Only set to false if leaving the canvas entirely
        if (e.currentTarget === e.target) {
            setIsDraggingFromPalette(false);
        }
    };

    const activeBlock = blocks.find((block) => block.id === activeId);

    return (
        <div
            className={`block-canvas ${isDraggingFromPalette ? 'dragging-from-palette' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            {blocks.length === 0 ? (
                <div className="empty-canvas">
                    <div className="empty-canvas-content">
                        <span className="empty-icon">📄</span>
                        <h3>Add your first block</h3>
                        <p>Click a block type from the palette or drag it here to get started</p>
                    </div>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                >
                    <SortableContext
                        items={blocks.map((b) => b.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="blocks-list">
                            {blocks.map((block) => {
                                const validationResult = blockValidationResults.get(block.id);
                                return (
                                    <SortableBlockItem
                                        key={block.id}
                                        block={block}
                                        isSelected={selectedBlockId === block.id}
                                        isInvalid={!!validationResult}
                                        validationErrors={validationResult?.errors}
                                        onSelect={() => onBlockSelect?.(block.id)}
                                        onDuplicate={() => onDuplicateBlock(block.id)}
                                        onDelete={() => onDeleteBlock(block.id)}
                                    />
                                );
                            })}
                        </div>
                    </SortableContext>

                    <DragOverlay>
                        {activeBlock ? (
                            <div className="block-drag-overlay">
                                <div className="block-type-badge">{activeBlock.type}</div>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}
        </div>
    );
};

export default BlockCanvas;
