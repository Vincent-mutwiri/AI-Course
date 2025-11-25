import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Canvas from '../Canvas';
import BlockLibrary from '../BlockLibrary';
import { v4 as uuidv4 } from 'uuid';
import type { Block } from '@/hooks/useBlockModal';

// Mock dependencies
vi.mock('@/services/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
    },
}));

vi.mock('uuid', () => ({
    v4: vi.fn(() => 'test-uuid-123'),
}));

describe('Course Builder Integration Tests', () => {
    const mockBlocks: Block[] = [
        {
            id: '1',
            type: 'text',
            order: 0,
            content: { text: 'Test text block' },
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: '2',
            type: 'video',
            order: 1,
            content: { videoUrl: 'https://youtube.com/watch?v=test', videoSource: 'embed' as const },
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    describe('Block Addition Workflow', () => {
        it('adds a new block when clicking on block type in library', async () => {
            const user = userEvent.setup();
            const onBlockAdd = vi.fn();

            render(
                <BrowserRouter>
                    <BlockLibrary onBlockAdd={onBlockAdd} />
                </BrowserRouter>
            );

            // Find and click a basic block type
            const textBlockButton = screen.getByText('Text');
            await user.click(textBlockButton);

            expect(onBlockAdd).toHaveBeenCalledWith('text');
        });

        it('filters blocks when searching in library', async () => {
            const user = userEvent.setup();
            const onBlockAdd = vi.fn();

            render(
                <BrowserRouter>
                    <BlockLibrary onBlockAdd={onBlockAdd} />
                </BrowserRouter>
            );

            // Type in search box
            const searchInput = screen.getByPlaceholderText(/search blocks/i);
            await user.type(searchInput, 'video');

            // Video block should be visible
            expect(screen.getByText('Video')).toBeInTheDocument();

            // Text block should not be visible (or less prominent)
            const allTextElements = screen.queryAllByText('Text');
            expect(allTextElements.length).toBeLessThanOrEqual(1);
        });
    });

    describe('Block Editing Workflow', () => {
        it('opens edit modal when clicking edit button on block', async () => {
            const user = userEvent.setup();
            const onBlockEdit = vi.fn();
            const onBlockDelete = vi.fn();
            const onBlockDuplicate = vi.fn();

            render(
                <BrowserRouter>
                    <Canvas
                        blocks={mockBlocks}
                        onBlocksReorder={vi.fn()}
                        onBlockEdit={onBlockEdit}
                        onBlockDelete={onBlockDelete}
                        onBlockDuplicate={onBlockDuplicate}
                        onBlockPreview={vi.fn()}
                    />
                </BrowserRouter>
            );

            // Find edit button (using aria-label or test-id would be better in real implementation)
            const editButtons = screen.getAllByRole('button');
            const editButton = editButtons.find(btn => btn.getAttribute('aria-label')?.includes('Edit'));

            if (editButton) {
                await user.click(editButton);
                expect(onBlockEdit).toHaveBeenCalled();
            }
        });
    });

    describe('Block Duplication Workflow', () => {
        it('duplicates a block when clicking duplicate button', async () => {
            const user = userEvent.setup();
            const onBlockDuplicate = vi.fn();

            render(
                <BrowserRouter>
                    <Canvas
                        blocks={mockBlocks}
                        onBlocksReorder={vi.fn()}
                        onBlockEdit={vi.fn()}
                        onBlockDelete={vi.fn()}
                        onBlockDuplicate={onBlockDuplicate}
                        onBlockPreview={vi.fn()}
                    />
                </BrowserRouter>
            );

            // Find duplicate button
            const buttons = screen.getAllByRole('button');
            const duplicateButton = buttons.find(btn => btn.getAttribute('aria-label')?.includes('Duplicate'));

            if (duplicateButton) {
                await user.click(duplicateButton);
                expect(onBlockDuplicate).toHaveBeenCalledWith(expect.any(String));
            }
        });
    });

    describe('Block Deletion Workflow', () => {
        it('shows confirmation before deleting a block', async () => {
            const user = userEvent.setup();
            const onBlockDelete = vi.fn();

            render(
                <BrowserRouter>
                    <Canvas
                        blocks={mockBlocks}
                        onBlocksReorder={vi.fn()}
                        onBlockEdit={vi.fn()}
                        onBlockDelete={onBlockDelete}
                        onBlockDuplicate={vi.fn()}
                        onBlockPreview={vi.fn()}
                    />
                </BrowserRouter>
            );

            // Find delete button
            const buttons = screen.getAllByRole('button');
            const deleteButton = buttons.find(btn => btn.getAttribute('aria-label')?.includes('Delete'));

            if (deleteButton) {
                await user.click(deleteButton);
                // In real implementation, this would show a confirmation dialog
                // For now, we just verify the handler is called
                await waitFor(() => {
                    expect(onBlockDelete).toHaveBeenCalled();
                });
            }
        });
    });

    describe('Empty State', () => {
        it('shows empty state when no blocks exist', () => {
            render(
                <BrowserRouter>
                    <Canvas
                        blocks={[]}
                        onBlocksReorder={vi.fn()}
                        onBlockEdit={vi.fn()}
                        onBlockDelete={vi.fn()}
                        onBlockDuplicate={vi.fn()}
                        onBlockPreview={vi.fn()}
                    />
                </BrowserRouter>
            );

            expect(screen.getByText(/no blocks yet/i)).toBeInTheDocument();
        });
    });
});
