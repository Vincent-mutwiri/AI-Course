/**
 * useBlockModal Hook
 * 
 * A custom React hook for managing block configuration modals in the course builder.
 * This hook provides a centralized state management solution for opening, closing,
 * and saving block configurations across all 21 block types (6 basic + 15 interactive).
 * 
 * Features:
 * - Tracks currently open modal and block being edited
 * - Supports both create and edit modes
 * - Handles block creation with unique IDs
 * - Handles block updates with timestamp tracking
 * - Automatically manages modal state lifecycle
 * 
 * Usage Example:
 * ```tsx
 * const { modalState, openModal, closeModal, handleSave } = useBlockModal({
 *   blocks,
 *   onBlocksChange: (updatedBlocks) => {
 *     setBlocks(updatedBlocks);
 *     setHasUnsavedChanges(true);
 *   },
 * });
 * 
 * // To create a new block
 * openModal('text');
 * 
 * // To edit an existing block
 * const block = blocks.find(b => b.id === blockId);
 * openModal(block.type, block);
 * ```
 * 
 * @module useBlockModal
 */

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Block type definition
export type BlockType =
    | 'text' | 'video' | 'image' | 'code' | 'list' | 'divider'
    | 'reflection' | 'poll' | 'wordCloud' | 'aiGenerator'
    | 'choiceComparison' | 'designFixer' | 'playerTypeSimulator'
    | 'rewardScheduleDesigner' | 'flowChannelEvaluator'
    | 'pitchAnalysisGenerator' | 'narrativeGenerator'
    | 'darkPatternRedesigner' | 'roeDashboard' | 'journeyTimeline'
    | 'certificateGenerator' | 'finalAssessment';

export interface Block {
    id: string;
    type: BlockType;
    order: number;
    content: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export interface BlockModalState {
    isOpen: boolean;
    blockType: BlockType | null;
    blockId: string | null;
    blockData: Partial<Block> | null;
    mode: 'create' | 'edit';
}

export interface UseBlockModalReturn {
    modalState: BlockModalState;
    openModal: (blockType: BlockType, blockData?: Partial<Block>) => void;
    closeModal: () => void;
    handleSave: (blockData: any) => void;
}

interface UseBlockModalProps {
    blocks: Block[];
    onBlocksChange: (blocks: Block[]) => void;
}

/**
 * Custom hook to manage block modal state and operations
 * 
 * This hook centralizes modal management for the course builder,
 * handling opening/closing modals, tracking the currently editing block,
 * and managing save operations for both creating and editing blocks.
 * 
 * @param blocks - Current array of blocks
 * @param onBlocksChange - Callback to update blocks array
 * @returns Modal state and control functions
 */
export function useBlockModal({ blocks, onBlocksChange }: UseBlockModalProps): UseBlockModalReturn {
    const [modalState, setModalState] = useState<BlockModalState>({
        isOpen: false,
        blockType: null,
        blockId: null,
        blockData: null,
        mode: 'create',
    });

    /**
     * Opens a modal for creating a new block or editing an existing one
     * 
     * @param blockType - The type of block to create/edit
     * @param blockData - Optional existing block data for editing
     */
    const openModal = useCallback((blockType: BlockType, blockData?: Partial<Block>) => {
        setModalState({
            isOpen: true,
            blockType,
            blockId: blockData?.id || null,
            blockData: blockData || null,
            mode: blockData?.id ? 'edit' : 'create',
        });
    }, []);

    /**
     * Closes the currently open modal and resets state
     */
    const closeModal = useCallback(() => {
        setModalState({
            isOpen: false,
            blockType: null,
            blockId: null,
            blockData: null,
            mode: 'create',
        });
    }, []);

    /**
     * Handles saving block data from modal
     * Creates a new block or updates an existing one
     * 
     * @param blockData - The block data from the modal form
     */
    const handleSave = useCallback((blockData: any) => {
        const { mode, blockId } = modalState;

        if (mode === 'create') {
            // Create new block
            const newBlock: Block = {
                id: uuidv4(),
                type: blockData.type,
                order: blocks.length,
                content: blockData.content,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // Add to end of blocks array
            const updatedBlocks = [...blocks, newBlock];
            onBlocksChange(updatedBlocks);
        } else if (mode === 'edit' && blockId) {
            // Update existing block
            const updatedBlocks = blocks.map((block) => {
                if (block.id === blockId) {
                    return {
                        ...block,
                        type: blockData.type,
                        content: blockData.content,
                        updatedAt: new Date(),
                    };
                }
                return block;
            });

            onBlocksChange(updatedBlocks);
        }

        // Close modal after save
        closeModal();
    }, [modalState, blocks, onBlocksChange, closeModal]);

    return {
        modalState,
        openModal,
        closeModal,
        handleSave,
    };
}
