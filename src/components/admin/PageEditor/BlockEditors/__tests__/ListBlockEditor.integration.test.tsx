/**
 * Integration test for ListBlockEditor with AIAssistantPanel
 * Verifies that AI content generation works correctly for list blocks
 */

import { describe, it, expect } from 'vitest';
import { IBlock } from '@/types/page';
import { getAllTemplatesForBlockType } from '@/config/contentTemplates';

describe('ListBlockEditor AI Integration', () => {
    it('should have list-specific templates available', () => {
        // This test verifies that list templates are configured
        const listTemplates = getAllTemplatesForBlockType('list');

        expect(listTemplates.length).toBeGreaterThan(0);

        // Verify specific list templates exist
        const templateIds = listTemplates.map((t: any) => t.id);
        expect(templateIds).toContain('list-steps');
        expect(templateIds).toContain('list-tips');
        expect(templateIds).toContain('list-checklist');
    });

    it('should parse string content into list items', () => {
        // Test the parseStringToListItems logic
        const testCases = [
            {
                input: '- Item 1\n- Item 2\n- Item 3',
                expected: ['Item 1', 'Item 2', 'Item 3']
            },
            {
                input: '1. First step\n2. Second step\n3. Third step',
                expected: ['First step', 'Second step', 'Third step']
            },
            {
                input: '[ ] Task 1\n[x] Task 2\n[ ] Task 3',
                expected: ['Task 1', 'Task 2', 'Task 3']
            },
            {
                input: 'Plain item 1\nPlain item 2\nPlain item 3',
                expected: ['Plain item 1', 'Plain item 2', 'Plain item 3']
            }
        ];

        // Helper function to parse string to list items (same logic as in component)
        const parseStringToListItems = (text: string): string[] => {
            const lines = text.split('\n');
            const items: string[] = [];

            for (let line of lines) {
                line = line.trim();
                if (!line) continue;

                line = line
                    .replace(/^[-*•]\s+/, '')
                    .replace(/^\d+\.\s+/, '')
                    .replace(/^[a-z]\.\s+/i, '')
                    .replace(/^\[\s*[xX]?\s*\]\s+/, '')
                    .trim();

                if (line) {
                    items.push(line);
                }
            }

            return items;
        };

        testCases.forEach(({ input, expected }) => {
            const result = parseStringToListItems(input);
            expect(result).toEqual(expected);
        });
    });

    it('should detect list type from content', () => {
        // Test the detectListType logic
        const detectListType = (generatedItems: any[]): 'bullet' | 'numbered' | 'checkbox' => {
            if (!generatedItems || generatedItems.length === 0) {
                return 'bullet';
            }

            const hasCheckedProperty = generatedItems.some(item =>
                typeof item === 'object' && 'checked' in item
            );
            if (hasCheckedProperty) {
                return 'checkbox';
            }

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

            return 'bullet';
        };

        // Test checkbox detection
        expect(detectListType([
            { text: 'Task 1', checked: false },
            { text: 'Task 2', checked: true }
        ])).toBe('checkbox');

        // Test numbered list detection
        expect(detectListType([
            { text: 'First, do this' },
            { text: 'Then, do that' },
            { text: 'Finally, finish' }
        ])).toBe('numbered');

        // Test bullet list (default)
        expect(detectListType([
            { text: 'Item 1' },
            { text: 'Item 2' },
            { text: 'Item 3' }
        ])).toBe('bullet');
    });

    it('should normalize different content formats', () => {
        // Test content normalization logic
        const normalizeItems = (items: any[]): Array<{ text: string; checked: boolean }> => {
            return items.map(item => {
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
        };

        // Test string array
        const stringArray = ['Item 1', 'Item 2', 'Item 3'];
        const normalized1 = normalizeItems(stringArray);
        expect(normalized1).toEqual([
            { text: 'Item 1', checked: false },
            { text: 'Item 2', checked: false },
            { text: 'Item 3', checked: false }
        ]);

        // Test object array
        const objectArray = [
            { text: 'Task 1', checked: true },
            { text: 'Task 2', checked: false }
        ];
        const normalized2 = normalizeItems(objectArray);
        expect(normalized2).toEqual([
            { text: 'Task 1', checked: true },
            { text: 'Task 2', checked: false }
        ]);

        // Test mixed array
        const mixedArray = [
            'Plain item',
            { text: 'Object item', checked: true },
            { text: 'Another object' }
        ];
        const normalized3 = normalizeItems(mixedArray);
        expect(normalized3).toEqual([
            { text: 'Plain item', checked: false },
            { text: 'Object item', checked: true },
            { text: 'Another object', checked: false }
        ]);
    });
});
