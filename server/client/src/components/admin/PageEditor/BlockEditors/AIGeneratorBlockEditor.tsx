import React from 'react';
import { IBlock } from '../../../../types/page';

interface AIGeneratorBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
}

const AIGeneratorBlockEditor: React.FC<AIGeneratorBlockEditorProps> = ({ block, onChange }) => {
    const generatorTypes = [
        { value: 'text', label: 'Text Generator' },
        { value: 'image', label: 'Image Generator' },
        { value: 'code', label: 'Code Generator' },
        { value: 'summary', label: 'Summary Generator' },
        { value: 'translation', label: 'Translation' },
        { value: 'custom', label: 'Custom' }
    ];

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange({ prompt: e.target.value });
    };

    const handleGeneratorTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({
            config: {
                ...block.content.config,
                generatorType: e.target.value
            }
        });
    };

    const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        onChange({
            config: {
                ...block.content.config,
                maxTokens: isNaN(value) ? 100 : value
            }
        });
    };

    const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        onChange({
            config: {
                ...block.content.config,
                temperature: isNaN(value) ? 0.7 : value
            }
        });
    };

    return (
        <div className="ai-generator-block-editor">
            <div className="form-group">
                <label htmlFor="generatorType">Generator Type</label>
                <select
                    id="generatorType"
                    value={block.content.config?.generatorType || 'text'}
                    onChange={handleGeneratorTypeChange}
                    className="form-control"
                >
                    {generatorTypes.map(type => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="prompt">Prompt</label>
                <textarea
                    id="prompt"
                    value={block.content.prompt || ''}
                    onChange={handlePromptChange}
                    placeholder="Enter the AI prompt or instructions"
                    className="form-control"
                    rows={4}
                />
            </div>

            <div className="form-group">
                <label htmlFor="maxTokens">Max Tokens</label>
                <input
                    type="number"
                    id="maxTokens"
                    value={block.content.config?.maxTokens || 100}
                    onChange={handleMaxTokensChange}
                    placeholder="100"
                    min="1"
                    max="4000"
                    className="form-control"
                />
                <small className="help-text">Maximum length of generated content</small>
            </div>

            <div className="form-group">
                <label htmlFor="temperature">Temperature</label>
                <input
                    type="number"
                    id="temperature"
                    value={block.content.config?.temperature || 0.7}
                    onChange={handleTemperatureChange}
                    placeholder="0.7"
                    min="0"
                    max="2"
                    step="0.1"
                    className="form-control"
                />
                <small className="help-text">Controls randomness (0 = deterministic, 2 = very random)</small>
            </div>
        </div>
    );
};

export default AIGeneratorBlockEditor;
