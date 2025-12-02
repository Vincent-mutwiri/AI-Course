import React from 'react';
import { IBlock } from '../../../../types/page';

interface DividerBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
}

const DividerBlockEditor: React.FC<DividerBlockEditorProps> = () => {
    return (
        <div className="divider-block-editor">
            <div className="divider-info">
                <p className="info-text">
                    This is a divider block. It will display as a horizontal line to separate content sections.
                </p>
            </div>

            <div className="divider-preview">
                <label>Preview</label>
                <hr className="preview-divider" />
            </div>
        </div>
    );
};

export default DividerBlockEditor;
