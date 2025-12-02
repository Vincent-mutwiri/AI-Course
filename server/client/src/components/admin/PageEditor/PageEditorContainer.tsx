import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IPage, IBlock } from '../../../types/page';
import PageMetadataForm from './PageMetadataForm';
import { debounce } from '../../../utils/debounce';

interface PageEditorContainerProps {
    isNewPage?: boolean;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

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

    // Refs for auto-save
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const retryCountRef = useRef<number>(0);
    const maxRetries = 3;

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
            } catch (error) {
                console.error('Error fetching page:', error);
                setSaveError('Failed to load page');
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [id, isNewPage]);

    // Save page function
    const savePage = useCallback(async (pageData: Partial<IPage>, blocksData: IBlock[]) => {
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
                throw new Error('Failed to save page');
            }

            const data = await response.json();
            setPage(data.page);
            setSaveState('saved');
            setLastSavedAt(new Date());
            setIsDirty(false);
            retryCountRef.current = 0;

            // If this was a new page, navigate to edit mode
            if (isNewPage && data.page._id) {
                navigate(`/admin/pages/${data.page._id}/edit`, { replace: true });
            }
        } catch (error) {
            console.error('Error saving page:', error);
            setSaveState('error');
            setSaveError('Failed to save page');

            // Retry logic
            if (retryCountRef.current < maxRetries) {
                retryCountRef.current++;
                setTimeout(() => {
                    savePage(pageData, blocksData);
                }, 10000); // Retry after 10 seconds
            }
        }
    }, [isNewPage, page, navigate]);

    // Debounced auto-save (30 seconds)
    const debouncedSave = useCallback(
        debounce((pageData: Partial<IPage>, blocksData: IBlock[]) => {
            savePage(pageData, blocksData);
        }, 30000),
        [savePage]
    );

    // Trigger auto-save when page or blocks change
    useEffect(() => {
        if (!loading && page && isDirty) {
            debouncedSave(page, blocks);
        }
    }, [page, blocks, isDirty, loading, debouncedSave]);

    // Handle page metadata changes
    const handlePageChange = useCallback((updates: Partial<IPage>) => {
        setPage(prev => prev ? { ...prev, ...updates } : null);
        setIsDirty(true);
    }, []);

    // Handle blocks changes
    const handleBlocksChange = useCallback((newBlocks: IBlock[]) => {
        setBlocks(newBlocks);
        setIsDirty(true);
    }, []);

    // Manual save
    const handleManualSave = useCallback(() => {
        if (page) {
            // Cancel any pending auto-save
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            savePage(page, blocks);
        }
    }, [page, blocks, savePage]);

    // Navigation guard for unsaved changes
    useEffect(() => {
        // Set global flag for NavigationGuard component
        (window as any).__hasUnsavedChanges = isDirty;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            (window as any).__hasUnsavedChanges = false;
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
            <div className="page-editor-header">
                <h1>{isNewPage ? 'Create New Page' : 'Edit Page'}</h1>
                <div className="page-editor-actions">
                    <div className="auto-save-indicator">
                        {saveState === 'saving' && <span className="saving">Saving...</span>}
                        {saveState === 'saved' && lastSavedAt && (
                            <span className="saved">
                                Saved at {lastSavedAt.toLocaleTimeString()}
                            </span>
                        )}
                        {saveState === 'error' && (
                            <span className="error">
                                {saveError || 'Error saving'}
                                {retryCountRef.current > 0 && ` (Retry ${retryCountRef.current}/${maxRetries})`}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleManualSave}
                        disabled={!isDirty || saveState === 'saving'}
                        className="btn-save"
                    >
                        Save Now
                    </button>
                </div>
            </div>

            <div className="page-editor-content">
                <PageMetadataForm
                    page={page}
                    onChange={handlePageChange}
                />

                {/* Block Palette and Canvas will be added in subsequent tasks */}
                <div className="blocks-section">
                    <p className="placeholder-text">
                        Block Palette and Canvas components will be implemented in the next tasks
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PageEditorContainer;
