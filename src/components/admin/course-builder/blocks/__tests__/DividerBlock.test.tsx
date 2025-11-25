import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DividerBlock } from '../DividerBlock';

describe('DividerBlock', () => {
    it('renders divider with default style', () => {
        const { container } = render(<DividerBlock />);
        const hr = container.querySelector('hr');
        expect(hr).toBeInTheDocument();
        expect(hr).toHaveClass('border-solid');
    });

    it('renders dashed divider', () => {
        const { container } = render(<DividerBlock content={{ style: 'dashed' }} />);
        const hr = container.querySelector('hr');
        expect(hr).toHaveClass('border-dashed');
    });

    it('renders dotted divider', () => {
        const { container } = render(<DividerBlock content={{ style: 'dotted' }} />);
        const hr = container.querySelector('hr');
        expect(hr).toHaveClass('border-dotted');
    });
});
