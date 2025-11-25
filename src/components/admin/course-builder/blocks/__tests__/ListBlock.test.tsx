import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ListBlock } from '../ListBlock';

describe('ListBlock', () => {
    it('renders empty state when no items provided', () => {
        render(<ListBlock content={{ items: [] }} />);
        expect(screen.getByText(/No list items configured/i)).toBeInTheDocument();
    });

    it('renders bullet list', () => {
        const items = [{ text: 'Item 1' }, { text: 'Item 2' }];
        render(<ListBlock content={{ items, listType: 'bullet' }} />);
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('renders numbered list', () => {
        const items = [{ text: 'First' }, { text: 'Second' }];
        render(<ListBlock content={{ items, listType: 'numbered' }} />);
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Second')).toBeInTheDocument();
    });

    it('renders checkbox list with checked items', () => {
        const items = [
            { text: 'Checked item', checked: true },
            { text: 'Unchecked item', checked: false },
        ];
        render(<ListBlock content={{ items, listType: 'checkbox' }} />);
        expect(screen.getByText('Checked item')).toBeInTheDocument();
        expect(screen.getByText('Unchecked item')).toBeInTheDocument();
    });
});
