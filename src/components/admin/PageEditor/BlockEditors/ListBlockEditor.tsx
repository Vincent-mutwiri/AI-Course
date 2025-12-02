import React from 'react';
import { IBlock } from '@/types/page';
import './BlockEditors.css';

interface ListBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
}

const ListBlockEditor: React.FC<ListBlockEditorProps> = ({ block, onChange }) => {
    const items = block.content.items || [];
    const listType = block.content.listType || 'bullet';

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
