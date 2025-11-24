import React from 'react';
import { List, CheckSquare } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface ListItem {
    text: string;
    checked?: boolean;
}

interface ListBlockProps {
    content: {
        items?: ListItem[];
        listType?: 'bullet' | 'numbered' | 'checkbox';
    };
    isPreview?: boolean;
}

export const ListBlock: React.FC<ListBlockProps> = ({ content, isPreview = false }) => {
    const { items = [], listType = 'bullet' } = content;

    if (items.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 border border-dashed border-gray-300 rounded bg-gray-50">
                <div className="text-center">
                    <List className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-400 italic">No list items configured. Click edit to add items.</p>
                </div>
            </div>
        );
    }

    const renderBulletList = () => (
        <ul className="list-disc list-inside space-y-2">
            {items.map((item, index) => (
                <li key={index} className="text-gray-700">
                    {item.text}
                </li>
            ))}
        </ul>
    );

    const renderNumberedList = () => (
        <ol className="list-decimal list-inside space-y-2">
            {items.map((item, index) => (
                <li key={index} className="text-gray-700">
                    {item.text}
                </li>
            ))}
        </ol>
    );

    const renderCheckboxList = () => (
        <div className="space-y-2">
            {items.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                    <Checkbox
                        checked={item.checked || false}
                        disabled={isPreview}
                        className="mt-1"
                    />
                    <span className={`text-gray-700 ${item.checked ? 'line-through text-gray-500' : ''}`}>
                        {item.text}
                    </span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="prose prose-sm max-w-none">
            {listType === 'bullet' && renderBulletList()}
            {listType === 'numbered' && renderNumberedList()}
            {listType === 'checkbox' && renderCheckboxList()}
        </div>
    );
};
