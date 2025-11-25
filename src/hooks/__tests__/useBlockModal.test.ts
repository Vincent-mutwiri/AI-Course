import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBlockModal } from '../useBlockModal';
import type { Block } from '@/lib/validation/blockSchemas';

describe('useBlockModal Hook', () => {
    const mockBlocks = [
        {
            id: '1',
            type: 'text' as const,
            order: 0,
            content: { text: 'Test' },
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ] as unknown as Block[];

    it('initializes with closed modal state', () => {
        const { result } = renderHook(() =>
            useBlockModal({
                // @ts-ignore - test mock blocks
                // @ts-ignore - test mock blocks
                blocks: mockBlocks,
                onBlocksChange: vi.fn(),
            })
        );

        expect(result.current.modalState.isOpen).toBe(false);
        expect(result.current.modalState.blockId).toBeNull();
        expect(result.current.modalState.blockType).toBeNull();
    });

    it('opens modal with correct block data', () => {
        const { result } = renderHook(() =>
            useBlockModal({
                // @ts-ignore - test mock blocks
                blocks: mockBlocks,
                onBlocksChange: vi.fn(),
            })
        );

        act(() => {
            result.current.openModal('text', mockBlocks[0]);
        });

        expect(result.current.modalState.isOpen).toBe(true);
        expect(result.current.modalState.blockId).toBe('1');
        expect(result.current.modalState.blockType).toBe('text');
        expect(result.current.modalState.mode).toBe('edit');
    });

    it('closes modal and resets state', () => {
        const { result } = renderHook(() =>
            useBlockModal({
                // @ts-ignore - test mock blocks
                blocks: mockBlocks,
                onBlocksChange: vi.fn(),
            })
        );

        act(() => {
            result.current.openModal('text', mockBlocks[0]);
        });

        act(() => {
            result.current.closeModal();
        });

        expect(result.current.modalState.isOpen).toBe(false);
        expect(result.current.modalState.blockId).toBeNull();
    });

    it('saves block changes and calls onBlocksChange', () => {
        const onBlocksChange = vi.fn();
        const { result } = renderHook(() =>
            useBlockModal({
                // @ts-ignore - test mock blocks
                blocks: mockBlocks,
                onBlocksChange,
            })
        );

        // Open modal in edit mode first
        act(() => {
            result.current.openModal('text', mockBlocks[0]);
        });

        const updatedBlockData = {
            type: 'text',
            content: { text: 'Updated text' },
        };

        act(() => {
            result.current.handleSave(updatedBlockData);
        });

        expect(onBlocksChange).toHaveBeenCalled();
        const updatedBlocks = onBlocksChange.mock.calls[0][0];
        expect(updatedBlocks[0].content).toEqual({ text: 'Updated text' });
    });
});
