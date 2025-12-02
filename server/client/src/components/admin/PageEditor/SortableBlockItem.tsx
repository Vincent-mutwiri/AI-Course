import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IBlock } from '../../../types/page';
import BlockToolbar from './BlockToolbar';

interface SortableBlockItemProps {
    block: IBlock;
    isSelected: boolean;
    isInvalid?: boolean;
    validationErrors?: Array<{ field: string; message: string }>;
    onSelect: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
}

const SortableBlockItem: React.FC<SortableBlockItemProps> = ({
    block,
    isSelected,
    isInvalid = false,
    validationErrors = [],
    onSelect,
    onDuplicate,
    onDelete,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`sortable-block-item ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''} ${isInvalid ? 'invalid' : ''}`}
            onClick={onSelect}
        >
            <BlockToolbar
                blockId={block.id}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
                dragHandleProps={{ ...attributes, ...listeners }}
            />

            <div className="block-content-preview">
                <div className="block-type-label">{block.type}</div>
                <div className="block-preview">
                    {renderBlockPreview(block)}
                </div>
            </div>

            {isInvalid && validationErrors.length > 0 && (
                <div className="block-validation-error">
                    <strong>Validation errors:</strong>
                    <ul>
                        {validationErrors.map((error, index) => (
                            <li key={index}>{error.message}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// Helper function to render a simple preview of block content
const renderBlockPreview = (block: IBlock): React.ReactNode => {
    const { type, content } = block;

    switch (type) {
        case 'text':
            return (
                <div className="text-preview">
                    {content.text ? (
                        <div dangerouslySetInnerHTML={{ __html: content.text.substring(0, 100) + (content.text.length > 100 ? '...' : '') }} />
                    ) : (
                        <span className="placeholder">Empty text block</span>
                    )}
                </div>
            );

        case 'video':
            return (
                <div className="video-preview">
                    🎥 {content.videoUrl ? `Video: ${content.videoProvider || 'embedded'}` : 'No video URL'}
                </div>
            );

        case 'image':
            return (
                <div className="image-preview">
                    {content.imageUrl ? (
                        <img src={content.imageUrl} alt={content.altText || 'Block image'} />
                    ) : (
                        <span className="placeholder">🖼️ No image</span>
                    )}
                </div>
            );

        case 'code':
            return (
                <div className="code-preview">
                    💻 {content.language || 'Code'} {content.code ? `(${content.code.length} chars)` : '(empty)'}
                </div>
            );

        case 'list':
            return (
                <div className="list-preview">
                    📋 {content.listType || 'List'} ({content.items?.length || 0} items)
                </div>
            );

        case 'divider':
            return (
                <div className="divider-preview">
                    ➖ Divider
                </div>
            );

        case 'reflection':
            return (
                <div className="interactive-preview">
                    💭 Reflection: {content.question || 'No question'}
                </div>
            );

        case 'poll':
            return (
                <div className="interactive-preview">
                    📊 Poll: {content.question || 'No question'}
                </div>
            );

        case 'wordCloud':
            return (
                <div className="interactive-preview">
                    ☁️ Word Cloud: {content.question || 'No question'}
                </div>
            );

        case 'aiGenerator':
            return (
                <div className="interactive-preview">
                    🤖 AI Generator: {content.prompt || 'No prompt'}
                </div>
            );

        default:
            return (
                <div className="generic-preview">
                    {type}: {content.title || content.question || content.prompt || 'Interactive block'}
                </div>
            );
    }
};

export default SortableBlockItem;
