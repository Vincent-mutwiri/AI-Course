import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TextBlock } from '../TextBlock';

describe('TextBlock', () => {
    it('renders text content', () => {
        render(<TextBlock content={{ text: '<p>Hello World</p>' }} />);
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders empty state when no text provided', () => {
        render(<TextBlock content={{}} />);
        expect(screen.getByText(/Empty text block/i)).toBeInTheDocument();
    });

    it('sanitizes HTML content', () => {
        const maliciousContent = '<p>Safe content</p><script>alert("XSS")</script>';
        render(<TextBlock content={{ text: maliciousContent }} />);
        expect(screen.getByText('Safe content')).toBeInTheDocument();
        expect(screen.queryByText(/alert/)).not.toBeInTheDocument();
    });

    it('truncates text in preview mode', () => {
        const longText = '<p>' + 'a'.repeat(200) + '</p>';
        render(<TextBlock content={{ text: longText }} isPreview={true} />);
        const element = screen.getByText(/a+\.\.\./);
        expect(element).toBeInTheDocument();
    });
});
