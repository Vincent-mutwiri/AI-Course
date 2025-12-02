import React from 'react';
import { IBlock } from '../../../../types/page';
import './BlockEditors.css';

interface CodeBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
}

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'scss', label: 'SCSS' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'json', label: 'JSON' },
    { value: 'yaml', label: 'YAML' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'plaintext', label: 'Plain Text' },
];

const CodeBlockEditor: React.FC<CodeBlockEditorProps> = ({ block, onChange }) => {
    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange({ code: e.target.value });
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ language: e.target.value });
    };

    return (
        <div className="code-block-editor">
            <div className="form-group">
                <label htmlFor="language">Programming Language</label>
                <select
                    id="language"
                    value={block.content.language || 'javascript'}
                    onChange={handleLanguageChange}
                    className="form-control"
                >
                    {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="code">Code</label>
                <textarea
                    id="code"
                    value={block.content.code || ''}
                    onChange={handleCodeChange}
                    placeholder="Enter your code here..."
                    className="form-control code-textarea"
                    rows={15}
                    spellCheck={false}
                />
            </div>

            {block.content.code && (
                <div className="code-preview">
                    <label>Preview</label>
                    <div className="preview-container">
                        <div className="preview-header">
                            <span className="language-badge">
                                {LANGUAGES.find(l => l.value === block.content.language)?.label || 'Code'}
                            </span>
                        </div>
                        <pre className="preview-code">
                            <code>{block.content.code}</code>
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodeBlockEditor;
