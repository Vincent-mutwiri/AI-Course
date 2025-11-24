import React from 'react';

interface DividerBlockProps {
    content?: {
        style?: 'solid' | 'dashed' | 'dotted';
        thickness?: 'thin' | 'medium' | 'thick';
    };
    isPreview?: boolean;
}

export const DividerBlock: React.FC<DividerBlockProps> = ({ content, isPreview = false }) => {
    const { style = 'solid', thickness = 'medium' } = content || {};

    const getThicknessClass = () => {
        switch (thickness) {
            case 'thin':
                return 'border-t';
            case 'thick':
                return 'border-t-4';
            case 'medium':
            default:
                return 'border-t-2';
        }
    };

    const getStyleClass = () => {
        switch (style) {
            case 'dashed':
                return 'border-dashed';
            case 'dotted':
                return 'border-dotted';
            case 'solid':
            default:
                return 'border-solid';
        }
    };

    return (
        <div className="py-4">
            <hr className={`${getThicknessClass()} ${getStyleClass()} border-gray-300`} />
        </div>
    );
};
