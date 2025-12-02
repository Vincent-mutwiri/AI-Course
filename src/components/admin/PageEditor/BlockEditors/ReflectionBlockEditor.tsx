import React from 'react';
import { IBlock } from '@/types/page';

interface ReflectionBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
}

const ReflectionBlockEditor: React.FC<ReflectionBlockEditorProps> = ({ block, onChange }) => {
    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ question: e.target.value });
    };

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange({ prompt: e.target.value });
    };

    const handleMinLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        onChange({
            config: {
                ...block.content.config,
                minLength: isNaN(value) ? 0 : value
            }
        });
    };

    return (
        <div className="reflection-block-editor">
            <div className="form-group">
                <label htmlFor="question">Question</label>
                <input
                    type="text"
                    id="question"
                    value={block.content.question || ''}
                    onChange={handleQuestionChange}
                    placeholder="Enter reflection question"
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label htmlFor="prompt">Prompt</label>
                <textarea
                    id="prompt"
                    value={block.content.prompt || ''}
                    onChange={handlePromptChange}
                    placeholder="Enter guidance or instructions for the reflection"
                    className="form-control"
                    rows={3}
                />
            </div>

            <div className="form-group">
                <label htmlFor="minLength">Minimum Length (characters)</label>
                <input
                    type="number"
                    id="minLength"
                    value={block.content.config?.minLength || 0}
                    onChange={handleMinLengthChange}
                    placeholder="0"
                    min="0"
                    className="form-control"
                />
            </div>
        </div>
    );
};

export default ReflectionBlockEditor;
