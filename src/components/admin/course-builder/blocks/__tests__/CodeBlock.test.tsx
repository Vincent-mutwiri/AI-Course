import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CodeBlock } from '../CodeBlock';

describe('CodeBlock', () => {
    it('renders empty state when no code provided', () => {
        render(<CodeBlock content={{}} />);
        expect(screen.getByText(/No code configured/i)).toBeInTheDocument();
    });

    it('renders code content', () => {
        const code = 'const hello = "world";';
        const { container } = render(<CodeBlock content={{ code, language: 'javascript' }} />);
        const codeElement = container.querySelector('code');
        expect(codeElement).toBeInTheDocument();
        expect(codeElement?.textContent).toContain('hello');
    });

    it('displays language badge', () => {
        render(<CodeBlock content={{ code: 'print("hello")', language: 'python' }} />);
        expect(screen.getByText('python')).toBeInTheDocument();
    });

    it('defaults to javascript language', () => {
        render(<CodeBlock content={{ code: 'console.log("test")' }} />);
        expect(screen.getByText('javascript')).toBeInTheDocument();
    });
});
