import React from 'react';
import { IBlock } from '../../../../types/page';

interface WordCloudBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
}

const WordCloudBlockEditor: React.FC<WordCloudBlockEditorProps> = ({ block, onChange }) => {
    const wordList = block.content.config?.wordList || [];

    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ question: e.target.value });
    };

    const handleWordChange = (index: number, value: string) => {
        const newWordList = [...wordList];
        newWordList[index] = value;
        onChange({
            config: {
                ...block.content.config,
                wordList: newWordList
            }
        });
    };

    const handleAddWord = () => {
        const newWordList = [...wordList, ''];
        onChange({
            config: {
                ...block.content.config,
                wordList: newWordList
            }
        });
    };

    const handleRemoveWord = (index: number) => {
        const newWordList = wordList.filter((_: any, i: number) => i !== index);
        onChange({
            config: {
                ...block.content.config,
                wordList: newWordList
            }
        });
    };

    return (
        <div className="wordcloud-block-editor">
            <div className="form-group">
                <label htmlFor="question">Question</label>
                <input
                    type="text"
                    id="question"
                    value={block.content.question || ''}
                    onChange={handleQuestionChange}
                    placeholder="Enter word cloud question"
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label>Pre-populated Words (Optional)</label>
                <p className="help-text">
                    Add words to pre-populate the word cloud. Leave empty to collect words from users.
                </p>
                <div className="words-list">
                    {wordList.map((word: string, index: number) => (
                        <div key={index} className="word-item">
                            <input
                                type="text"
                                value={word}
                                onChange={(e) => handleWordChange(index, e.target.value)}
                                placeholder={`Word ${index + 1}`}
                                className="form-control"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveWord(index)}
                                className="btn-remove"
                                title="Remove word"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={handleAddWord}
                    className="btn-add"
                >
                    + Add Word
                </button>
            </div>
        </div>
    );
};

export default WordCloudBlockEditor;
