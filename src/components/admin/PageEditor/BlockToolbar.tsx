import React, { useState } from 'react';

interface BlockToolbarProps {
    blockId: string;
    onDuplicate: () => void;
    onDelete: () => void;
    dragHandleProps?: any;
}

const BlockToolbar: React.FC<BlockToolbarProps> = ({
    blockId,
    onDuplicate,
    onDelete,
    dragHandleProps,
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDuplicateClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDuplicate();
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
        setShowDeleteConfirm(false);
    };

    const handleCancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteConfirm(false);
    };

    return (
        <div className="block-toolbar">
            <div className="toolbar-left">
                <button
                    className="toolbar-btn drag-handle"
                    title="Drag to reorder"
                    {...dragHandleProps}
                >
                    <span className="icon">⋮⋮</span>
                </button>
            </div>

            <div className="toolbar-right">
                {showDeleteConfirm ? (
                    <div className="delete-confirm">
                        <span className="confirm-text">Delete this block?</span>
                        <button
                            className="toolbar-btn confirm-btn"
                            onClick={handleConfirmDelete}
                            title="Confirm delete"
                        >
                            ✓
                        </button>
                        <button
                            className="toolbar-btn cancel-btn"
                            onClick={handleCancelDelete}
                            title="Cancel"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            className="toolbar-btn duplicate-btn"
                            onClick={handleDuplicateClick}
                            title="Duplicate block"
                        >
                            <span className="icon">📋</span>
                        </button>
                        <button
                            className="toolbar-btn delete-btn"
                            onClick={handleDeleteClick}
                            title="Delete block"
                        >
                            <span className="icon">🗑️</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default BlockToolbar;
