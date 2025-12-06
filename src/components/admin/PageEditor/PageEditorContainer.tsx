import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { IPage, IBlock, BlockType } from '../../../types/page';
import PageMetadataForm from './PageMetadataForm';
import BlockPalette from './BlockPalette';
import BlockCanvas from './BlockCanvas';
import BlockEditorPanel from './BlockEditorPanel';
import AutoSaveIndicator, { SaveState } from './AutoSaveIndicator';
import PagePreview from './PagePreview';
import ErrorNotification from '@/components/common/ErrorNotification';
import NavigationGuard from '@/components/common/NavigationGuard';
import { debounce } from '@/utils/debounce';
import { cachePageData, getCachedPageData, clearCachedPageData, hasCachedPageData } from '@/utils/localStorageCache';
import './BlockEditor.css';

interface PageEditorContainerProps {
    isNewPage?: boolean;
}

const PageEditorContainer: React.FC<PageEditorContainerProps> = ({ isNewPage = false }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // State management
    const [page, setPage] = useState<IPage | null>(null);
    const [blocks, setBlocks] = useState<IBlock[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [saveState, setSaveState] = useState<SaveState>('idle');
    const [saveError, setSaveError] = useState<string | null>(null);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
    const [isMetadataValid, setIsMetadataValid] = useState<boolean>(false);
    const [networkError, setNetworkError] = useState<string | null>(null);
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

    // Refs for auto-save
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const retryCountRef = useRef<number>(0);
    const maxRetries = 3;

    // Monitor online/offline status
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setNetworkError(null);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setNetworkError('You are currently offline. Changes will be saved locally.');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Fetch page data on mount
    useEffect(() => {
        const fetchPage = async () => {
            if (isNewPage) {
                // Initialize empty page for new pages
                const emptyPage: Partial<IPage> = {
                    title: '',
                    slug: '',
                    content: {
                        blocks: [],
                        version: '1.0'
                    },
                    isPublished: false,
                    type: 'page'
                };
                setPage(emptyPage as IPage);
                setBlocks([]);
                setLoading(false);
                return;
            }

            if (!id) {
                setLoading(false);
                return;
            }

            // Check for cached data first
            if (hasCachedPageData(id)) {
                const cached = getCachedPageData(id);
                if (cached) {
                    setPage(cached.page as IPage);
                    setBlocks(cached.blocks);
                    setNetworkError('Loaded from local cache. Attempting to sync with server...');
                }
            }

            try {
                const response = await fetch(`/api/admin/pages/${id}/edit`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch page');
                }

                const data = await response.json();
                setPage(data.page);
                setBlocks(data.page.content.blocks || []);

                // Clear cache on successful fetch
                clearCachedPageData(id);
                setNetworkError(null);
            } catch (error) {
                console.error('Error fetching page:', error);

                // If we have cached data, use it
                if (hasCachedPageData(id)) {
                    setNetworkError('Failed to load from server. Using cached data.');
                } else {
                    setSaveError('Failed to load page');
                    setNetworkError('Failed to load page from server.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [id, isNewPage]);

    // Save page function
    const savePage = useCallback(async (pageData: Partial<IPage>, blocksData: IBlock[], isManualSave: boolean = false) => {
        // Don't save if title or slug is empty
        if (!pageData.title?.trim() || !pageData.slug?.trim()) {
            if (isManualSave) {
                toast.error('Please enter a title and slug before saving');
            }
            return;
        }

        // Validate metadata before saving
        if (!isMetadataValid) {
            const errorMsg = 'Please fix validation errors before saving';
            setSaveError(errorMsg);
            setSaveState('error');
            if (isManualSave) {
                toast.error(errorMsg);
            }
            return;
        }

        setSaveState('saving');
        setSaveError(null);

        try {
            const endpoint = isNewPage || !page?._id
                ? '/api/admin/pages'
                : `/api/admin/pages/${page._id}`;

            const method = isNewPage || !page?._id ? 'POST' : 'PUT';

            const payload = {
                ...pageData,
                content: {
                    blocks: blocksData,
                    version: '1.0'
                }
            };

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || 'Failed to save page');
            }

            const data = await response.json();
            setPage(data.page);
            setSaveState('saved');
            setLastSavedAt(new Date());
            setIsDirty(false);
            retryCountRef.current = 0;

            // Show success toast notification
            if (isManualSave) {
                toast.success('Page saved successfully');
            }

            // If this was a new page, navigate to edit mode
            if (isNewPage && data.page._id) {
                navigate(`/admin/pages/${data.page._id}/edit`, { replace: true });
            }
        } catch (error) {
            console.error('Error saving page:', error);
            setSaveState('error');
            setSaveError(error instanceof Error ? error.message : 'Failed to save page');

            if (isManualSave) {
                toast.error(error instanceof Error ? error.message : 'Failed to save page');
            }

            // Check if it's a network error
            const isNetworkError = !navigator.onLine || error instanceof TypeError;

            if (isNetworkError) {
                const errorMsg = 'Network error. Changes saved locally.';
                setSaveError(errorMsg);
                setNetworkError('Unable to reach server. Your changes are saved locally and will sync when connection is restored.');

                // Show error toast with retry option
                toast.error(errorMsg, {
                    action: {
                        label: 'Retry',
                        onClick: () => savePage(pageData, blocksData, true)
                    }
                });

                // Cache the data locally
                if (page?._id) {
                    cachePageData(page._id, pageData, blocksData);
                }
            } else {
                const errorMsg = 'Failed to save page';
                setSaveError(errorMsg);
                setNetworkError('Failed to save page. Please try again.');

                // Show error toast with retry option
                toast.error(errorMsg, {
                    action: {
                        label: 'Retry',
                        onClick: () => savePage(pageData, blocksData, true)
                    }
                });
            }

            // Retry logic for transient failures (up to 3 attempts)
            if (retryCountRef.current < maxRetries && !isNetworkError) {
                retryCountRef.current++;

                // Show retry notification
                toast.info(`Retrying save (${retryCountRef.current}/${maxRetries})...`, {
                    duration: 2000
                });

                setTimeout(() => {
                    savePage(pageData, blocksData, false);
                }, 2000); // Retry after 2 seconds
            } else if (retryCountRef.current >= maxRetries) {
                // Max retries reached
                toast.error('Failed to save after multiple attempts. Please try again manually.', {
                    duration: 6000,
                    action: {
                        label: 'Retry Now',
                        onClick: () => {
                            retryCountRef.current = 0;
                            savePage(pageData, blocksData, true);
                        }
                    }
                });
            }
        }
    }, [isNewPage, page, navigate, isMetadataValid, maxRetries]);

    // Debounced auto-save (2 seconds)
    const debouncedSave = useCallback(
        debounce((pageData: Partial<IPage>, blocksData: IBlock[]) => {
            savePage(pageData, blocksData, false);
        }, 2000),
        [savePage]
    );

    // Trigger auto-save when page or blocks change
    useEffect(() => {
        // Only auto-save if page has valid title and slug
        if (!loading && page && isDirty && page.title?.trim() && page.slug?.trim()) {
            debouncedSave(page, blocks);
        }
    }, [page, blocks, isDirty, loading, debouncedSave]);

    // Handle page metadata changes
    const handlePageChange = useCallback((updates: Partial<IPage>) => {
        setPage(prev => prev ? { ...prev, ...updates } : null);
        setIsDirty(true);
    }, []);

    // Handle metadata validation state changes
    const handleMetadataValidationChange = useCallback((isValid: boolean) => {
        setIsMetadataValid(isValid);
    }, []);

    // Handle blocks changes
    const handleBlocksChange = useCallback((newBlocks: IBlock[]) => {
        setBlocks(newBlocks);
        setIsDirty(true);
    }, []);

    // Handle block content change
    const handleBlockContentChange = useCallback((blockId: string, content: Partial<IBlock['content']>) => {
        setBlocks(prevBlocks =>
            prevBlocks.map(block =>
                block.id === blockId
                    ? { ...block, content: { ...block.content, ...content }, updatedAt: new Date() }
                    : block
            )
        );
        setIsDirty(true);
    }, []);

    // Add new block
    const handleAddBlock = useCallback((blockType: BlockType) => {
        const newBlock: IBlock = {
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: blockType,
            order: blocks.length,
            content: {},
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const newBlocks = [...blocks, newBlock];
        setBlocks(newBlocks);
        setIsDirty(true);
        setSelectedBlockId(newBlock.id);
    }, [blocks]);

    // Reorder blocks
    const handleReorderBlocks = useCallback(async (blockIds: string[]) => {
        if (!page?._id) return;

        try {
            const response = await fetch(`/api/admin/pages/${page._id}/blocks/reorder`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ blockIds })
            });

            if (!response.ok) {
                throw new Error('Failed to reorder blocks');
            }

            const data = await response.json();
            setBlocks(data.blocks);
        } catch (error) {
            console.error('Error reordering blocks:', error);

            // Show network error notification
            if (!navigator.onLine) {
                setNetworkError('Cannot reorder blocks while offline. Changes will sync when connection is restored.');
            } else {
                setNetworkError('Failed to reorder blocks. Please try again.');
            }

            throw error;
        }
    }, [page]);

    // Duplicate block
    const handleDuplicateBlock = useCallback(async (blockId: string) => {
        if (!page?._id) {
            // For new pages, duplicate locally
            const blockIndex = blocks.findIndex(b => b.id === blockId);
            if (blockIndex === -1) return;

            const originalBlock = blocks[blockIndex];
            const duplicatedBlock: IBlock = {
                ...originalBlock,
                id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                order: originalBlock.order + 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const newBlocks = [
                ...blocks.slice(0, blockIndex + 1),
                duplicatedBlock,
                ...blocks.slice(blockIndex + 1).map(b => ({ ...b, order: b.order + 1 }))
            ];

            setBlocks(newBlocks);
            setIsDirty(true);
            setSelectedBlockId(duplicatedBlock.id);
            return;
        }

        try {
            const response = await fetch(`/api/admin/pages/${page._id}/blocks/${blockId}/duplicate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to duplicate block');
            }

            const data = await response.json();

            // Refresh blocks from server
            const pageResponse = await fetch(`/api/admin/pages/${page._id}/edit`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (pageResponse.ok) {
                const pageData = await pageResponse.json();
                setBlocks(pageData.page.content.blocks || []);
                setSelectedBlockId(data.block.id);
            }
        } catch (error) {
            console.error('Error duplicating block:', error);

            // Show network error notification
            if (!navigator.onLine) {
                setNetworkError('Cannot duplicate blocks while offline.');
            } else {
                setNetworkError('Failed to duplicate block. Please try again.');
            }
        }
    }, [page, blocks]);

    // Delete block
    const handleDeleteBlock = useCallback(async (blockId: string) => {
        if (!page?._id) {
            // For new pages, delete locally
            const newBlocks = blocks
                .filter(b => b.id !== blockId)
                .map((b, index) => ({ ...b, order: index }));

            setBlocks(newBlocks);
            setIsDirty(true);
            if (selectedBlockId === blockId) {
                setSelectedBlockId(null);
            }
            return;
        }

        try {
            const response = await fetch(`/api/admin/pages/${page._id}/blocks/${blockId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete block');
            }

            // Refresh blocks from server
            const pageResponse = await fetch(`/api/admin/pages/${page._id}/edit`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (pageResponse.ok) {
                const pageData = await pageResponse.json();
                setBlocks(pageData.page.content.blocks || []);
                if (selectedBlockId === blockId) {
                    setSelectedBlockId(null);
                }
            }
        } catch (error) {
            console.error('Error deleting block:', error);

            // Show network error notification
            if (!navigator.onLine) {
                setNetworkError('Cannot delete blocks while offline.');
            } else {
                setNetworkError('Failed to delete block. Please try again.');
            }
        }
    }, [page, blocks, selectedBlockId]);

    // Manual save
    const handleManualSave = useCallback(() => {
        if (page) {
            // Cancel any pending auto-save
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            // Reset retry count for manual saves
            retryCountRef.current = 0;
            savePage(page, blocks, true);
        }
    }, [page, blocks, savePage]);

    // Toggle preview mode
    const handleTogglePreview = useCallback(() => {
        setIsPreviewMode(prev => !prev);
    }, []);

    // Handle back navigation
    const handleBack = useCallback(() => {
        if (isDirty) {
            const confirmLeave = window.confirm(
                'You have unsaved changes. Are you sure you want to leave?'
            );
            if (!confirmLeave) {
                return;
            }
        }
        navigate('/admin/pages');
    }, [isDirty, navigate]);

    // Handle cancel (same as back)
    const handleCancel = useCallback(() => {
        handleBack();
    }, [handleBack]);

    // Navigation guard for unsaved changes (browser close/refresh)
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty]);

    if (loading) {
        return (
            <div className="page-editor-loading">
                <div className="spinner"></div>
                <p>Loading page editor...</p>
            </div>
        );
    }

    if (!page) {
        return (
            <div className="page-editor-error">
                <p>Failed to load page</p>
                <button onClick={() => navigate('/admin/pages')}>Back to Pages</button>
            </div>
        );
    }

    return (
        <div className="page-editor-container">
            <NavigationGuard when={isDirty} />

            {networkError && (
                <ErrorNotification
                    message={networkError}
                    onRetry={isOnline ? handleManualSave : undefined}
                    onDismiss={() => setNetworkError(null)}
                />
            )}

            <div className="page-editor-header">
                <div className="page-editor-header-left">
                    <button
                        onClick={handleBack}
                        className="btn-back"
                        title="Back to Pages"
                    >
                        ← Back
                    </button>
                    <h1>{isNewPage ? 'Create New Page' : 'Edit Page'}</h1>
                    {!isOnline && (
                        <div className="offline-indicator">
                            📡 Offline Mode
                        </div>
                    )}
                </div>
                <div className="page-editor-actions">
                    <AutoSaveIndicator
                        saveState={saveState}
                        lastSavedAt={lastSavedAt}
                        saveError={saveError}
                        retryCount={retryCountRef.current}
                        maxRetries={maxRetries}
                    />
                    <button
                        onClick={handleTogglePreview}
                        className="btn-preview"
                    >
                        {isPreviewMode ? 'Exit Preview' : 'Preview'}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="btn-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleManualSave}
                        disabled={!isDirty || saveState === 'saving' || !isMetadataValid}
                        className="btn-save"
                        title={!isMetadataValid ? 'Please fix validation errors before saving' : ''}
                    >
                        Save Now
                    </button>
                </div>
            </div>

            <div className="page-editor-content">
                <PageMetadataForm
                    page={page}
                    onChange={handlePageChange}
                    onValidationChange={handleMetadataValidationChange}
                />

                <div className="blocks-section">
                    <BlockPalette
                        onAddBlock={handleAddBlock}
                    />
                    <BlockCanvas
                        blocks={blocks}
                        onBlocksChange={handleBlocksChange}
                        onReorderBlocks={handleReorderBlocks}
                        onDuplicateBlock={handleDuplicateBlock}
                        onDeleteBlock={handleDeleteBlock}
                        onBlockSelect={setSelectedBlockId}
                        selectedBlockId={selectedBlockId}
                    />
                    <BlockEditorPanel
                        block={blocks.find(b => b.id === selectedBlockId) || null}
                        onBlockChange={handleBlockContentChange}
                        onClose={() => setSelectedBlockId(null)}
                        courseContext={{
                            lessonId: page._id,
                            lessonName: page.title,
                        }}
                        existingBlocks={blocks}
                    />
                </div>
            </div>

            <PagePreview
                page={page}
                blocks={blocks}
                isPreviewMode={isPreviewMode}
                onTogglePreview={handleTogglePreview}
            />
        </div>
    );
};

export default PageEditorContainer;
