import React from 'react';
import { IBlock } from '@/types/page';

interface PollBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
}

const PollBlockEditor: React.FC<PollBlockEditorProps> = ({ block, onChange }) => {
    const options = block.content.options || [];

    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ question: e.target.value });
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        onChange({ options: newOptions });
    };

    const handleAddOption = () => {
        const newOptions = [...options, ''];
        onChange({ options: newOptions });
    };

    const handleRemoveOption = (index: number) => {
        const newOptions = options.filter((_: any, i: number) => i !== index);
        onChange({ options: newOptions });
    };

    return (
        <div className="poll-block-editor">
            <div className="form-group">
                <label htmlFor="question">Question</label>
                <input
                    type="text"
                    id="question"
                    value={block.content.question || ''}
                    onChange={handleQuestionChange}
                    placeholder="Enter poll question"
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label>Options</label>
                <div className="options-list">
                    {options.map((option: string, index: number) => (
                        <div key={index} className="option-item">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="form-control"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveOption(index)}
                                className="btn-remove"
                                title="Remove option"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={handleAddOption}
                    className="btn-add"
                >
                    + Add Option
                </button>
            </div>
        </div>
    );
};

export default PollBlockEditor;
