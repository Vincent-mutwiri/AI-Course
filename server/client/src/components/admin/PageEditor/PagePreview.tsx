import React from 'react';
import { IPage, IBlock } from '../../../types/page';
import BlockRenderer from './BlockRenderer';

interface PagePreviewProps {
    page: IPage;
    blocks: IBlock[];
    isPreviewMode: boolean;
    onTogglePreview: () => void;
}

/**
 * PagePreview component provides a preview mode for the page editor
 * It renders blocks using the same frontend rendering logic that end users will see
 */
const PagePreview: React.FC<PagePreviewProps> = ({
    page,
    blocks,
    isPreviewMode,
    onTogglePreview,
}) => {
    if (!isPreviewMode) {
        return null;
    }

    return (
        <div className="page-preview-overlay">
            <div className="page-preview-header">
                <div className="preview-indicator">
                    <span className="preview-icon">👁️</span>
                    <span className="preview-text">Preview Mode</span>
                    <span className="preview-note">This is how your page will appear to users</span>
                </div>
                <button
                    onClick={onTogglePreview}
                    className="btn-exit-preview"
                >
                    Exit Preview
                </button>
            </div>

            <div className="page-preview-content">
                <div className="page-preview-container">
                    <article className="page-article">
                        <header className="page-header">
                            <h1 className="page-title">{page.title || 'Untitled Page'}</h1>
                            {page.type && (
                                <span className="page-type-badge">{page.type}</span>
                            )}
                        </header>

                        <div className="page-blocks">
                            {blocks.length === 0 ? (
                                <div className="empty-preview">
                                    <p>No blocks to preview. Add some blocks to see them here.</p>
                                </div>
                            ) : (
                                blocks
                                    .sort((a, b) => a.order - b.order)
                                    .map((block) => (
                                        <div key={block.id} className="block-wrapper">
                                            <BlockRenderer block={block} isPreview={true} />
                                        </div>
                                    ))
                            )}
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default PagePreview;
