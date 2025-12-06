import React, { useState } from 'react';
import { IBlock } from '@/types/page';
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
import { CourseContext, CourseContextBuilder } from '@/services/courseContextBuilder';
import './BlockEditors.css';

interface ListBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
    courseContext?: CourseContext;
    existingBlocks?: IBlock[];
}

const ListBlockEditor: React.FC<ListBlockEditorProps> = ({
    block,
    onChange,
    courseContext,
    existingBlocks
}) => {
    const items = block.content.items || [];
    const listType = block.content.listType || 'bullet';
    const [showAIAssistant, setShowAIAssistant] = useState(true);

    const handleListTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ listType: e.target.value as 'bullet' | 'numbered' | 'checkbox' });
    };

    const handleItemTextChange = (index: number, text: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], text };
        onChange({ items: newItems });
    };

    const handleItemCheckedChange = (index: number, checked: boolean) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], checked };
        onChange({ items: newItems });
    };

    const handleAddItem = () => {
        const newItems = [...items, { text: '', checked: false }];
        onChange({ items: newItems });
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        onChange({ items: newItems });
    };

    const handleMoveItem = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === items.length - 1)
        ) {
            return;
        }

        const newItems = [...items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        onChange({ items: newItems });
    };

    /**
     * Build course context for AI generation
     * Uses provided context or creates a minimal context
     */
    const buildCourseContext = (): CourseContext => {
        if (courseContext) {
            // Use provided context and add existing blocks
            return {
                ...courseContext,
                existingBlocks: existingBlocks || courseContext.existingBlocks
            };
        }

        // Create minimal context if none provided
        return CourseContextBuilder.buildContext({
            existingBlocks: existingBlocks
        });
    };

    /**
     * Auto-detect list type from generated content
     * Analyzes the content to determine if it should be bullet, numbered, or checkbox
     */
    const detectListType = (generatedItems: any[]): 'bullet' | 'numbered' | 'checkbox' => {
        if (!generatedItems || generatedItems.length === 0) {
            return 'bullet';
        }

        // Check if items have checked property (checkbox list)
        const hasCheckedProperty = generatedItems.some(item =>
            typeof item === 'object' && 'checked' in item
        );
        if (hasCheckedProperty) {
            return 'checkbox';
        }

        // Check if items suggest sequential steps (numbered list)
        const sequentialKeywords = ['step', 'first', 'second', 'third', 'then', 'next', 'finally'];
        const hasSequentialContent = generatedItems.some(item => {
            const text = typeof item === 'string' ? item : item.text || '';
            return sequentialKeywords.some(keyword =>
                text.toLowerCase().includes(keyword)
            );
        });
        if (hasSequentialContent) {
            return 'numbered';
        }

        // Default to bullet list
        return 'bullet';
    };

    /**
     * Handle AI-generated content
     * Populates list items from AI-generated content and auto-detects list type
     */
    const handleContentGenerated = (content: any) => {
        let generatedItems: any[] = [];
        let detectedListType: 'bullet' | 'numbered' | 'checkbox' = 'bullet';

        // Handle different content formats
        if (Array.isArray(content)) {
            // Content is already an array of items
            generatedItems = content;
        } else if (content.items && Array.isArray(content.items)) {
            // Content has an items property
            generatedItems = content.items;
            // Use provided list type if available
            if (content.listType) {
                detectedListType = content.listType;
            }
        } else if (typeof content === 'string') {
            // Content is a string, parse it into list items
            generatedItems = parseStringToListItems(content);
        } else if (content.text && typeof content.text === 'string') {
            // Content has a text property
            generatedItems = parseStringToListItems(content.text);
        }

        // Normalize items to have consistent structure
        const normalizedItems = generatedItems.map(item => {
            if (typeof item === 'string') {
                return { text: item.trim(), checked: false };
            } else if (typeof item === 'object' && item !== null) {
                return {
                    text: item.text || String(item),
                    checked: item.checked || false
                };
            }
            return { text: String(item), checked: false };
        }).filter(item => item.text.length > 0);

        // Auto-detect list type if not explicitly provided
        if (!content.listType) {
            detectedListType = detectListType(normalizedItems);
        }

        // Update the block content
        onChange({
            items: normalizedItems,
            listType: detectedListType
        });
    };

    /**
     * Parse a string into list items
     * Handles various list formats (bullet points, numbered lists, plain lines)
     */
    const parseStringToListItems = (text: string): string[] => {
        // Split by newlines
        const lines = text.split('\n');

        const items: string[] = [];

        for (let line of lines) {
            line = line.trim();

            // Skip empty lines
            if (!line) continue;

            // Remove common list markers
            line = line
                .replace(/^[-*•]\s+/, '') // Bullet points
                .replace(/^\d+\.\s+/, '') // Numbered lists
                .replace(/^[a-z]\.\s+/i, '') // Lettered lists
                .replace(/^\[\s*[xX]?\s*\]\s+/, '') // Checkboxes
                .trim();

            if (line) {
                items.push(line);
            }
        }

        return items;
    };

    const renderPreview = () => {
        if (items.length === 0) return null;

        if (listType === 'bullet') {
            return (
                <ul className="preview-list">
                    {items.map((item, index) => (
                        <li key={index}>{item.text || '(empty)'}</li>
                    ))}
                </ul>
            );
        } else if (listType === 'numbered') {
            return (
                <ol className="preview-list">
                    {items.map((item, index) => (
                        <li key={index}>{item.text || '(empty)'}</li>
                    ))}
                </ol>
            );
        } else if (listType === 'checkbox') {
            return (
                <ul className="preview-list checkbox-list">
                    {items.map((item, index) => (
                        <li key={index}>
                            <input
                                type="checkbox"
                                checked={item.checked || false}
                                readOnly
                            />
                            <span>{item.text || '(empty)'}</span>
                        </li>
                    ))}
                </ul>
            );
        }
    };

    return (
        <div className="list-block-editor">
            {/* AI Content Assistant Panel */}
            {showAIAssistant && (
                <div className="ai-assistant-wrapper" style={{ marginBottom: '1rem' }}>
                    <AIAssistantPanel
                        blockType="list"
                        courseContext={buildCourseContext()}
                        onContentGenerated={handleContentGenerated}
                        currentContent={block.content}
                        placeholder="Describe the list you want to generate (e.g., 'Create a step-by-step guide for setting up a development environment' or 'Generate a checklist for launching a new product')"
                    />
                </div>
            )}

            <div className="form-group">
                <label htmlFor="listType">List Type</label>
                <select
                    id="listType"
                    value={listType}
                    onChange={handleListTypeChange}
                    className="form-control"
                >
                    <option value="bullet">Bullet List</option>
                    <option value="numbered">Numbered List</option>
                    <option value="checkbox">Checkbox List</option>
                </select>
            </div>

            <div className="form-group">
                <label>List Items</label>
                <div className="list-items">
                    {items.map((item, index) => (
                        <div key={index} className="list-item-row">
                            {listType === 'checkbox' && (
                                <input
                                    type="checkbox"
                                    checked={item.checked || false}
                                    onChange={(e) => handleItemCheckedChange(index, e.target.checked)}
                                    className="item-checkbox"
                                />
                            )}
                            <input
                                type="text"
                                value={item.text}
                                onChange={(e) => handleItemTextChange(index, e.target.value)}
                                placeholder={`Item ${index + 1}`}
                                className="form-control item-input"
                            />
                            <div className="item-actions">
                                <button
                                    type="button"
                                    onClick={() => handleMoveItem(index, 'up')}
                                    disabled={index === 0}
                                    className="btn-icon"
                                    title="Move up"
                                >
                                    ↑
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMoveItem(index, 'down')}
                                    disabled={index === items.length - 1}
                                    className="btn-icon"
                                    title="Move down"
                                >
                                    ↓
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index)}
                                    className="btn-icon btn-danger"
                                    title="Remove item"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={handleAddItem}
                    className="btn-add-item"
                >
                    + Add Item
                </button>
            </div>

            {items.length > 0 && (
                <div className="list-preview">
                    <label>Preview</label>
                    {renderPreview()}
                </div>
            )}
        </div>
    );
};

export default ListBlockEditor;
