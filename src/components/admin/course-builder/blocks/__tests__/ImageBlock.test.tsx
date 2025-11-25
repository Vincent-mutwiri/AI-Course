import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImageBlock } from '../ImageBlock';

describe('ImageBlock', () => {
    it('renders empty state when no image URL provided', () => {
        render(<ImageBlock content={{}} />);
        expect(screen.getByText(/No image configured/i)).toBeInTheDocument();
    });

    it('renders image with alt text', () => {
        render(
            <ImageBlock
                content={{
                    imageUrl: 'https://example.com/image.jpg',
                    altText: 'Test Image',
                }}
            />
        );
        const img = screen.getByAltText('Test Image');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('renders caption when provided', () => {
        render(
            <ImageBlock
                content={{
                    imageUrl: 'https://example.com/image.jpg',
                    altText: 'Test Image',
                    caption: 'This is a test caption',
                }}
            />
        );
        expect(screen.getByText('This is a test caption')).toBeInTheDocument();
    });

    it('shows alt text in preview mode', () => {
        render(
            <ImageBlock
                content={{
                    imageUrl: 'https://example.com/image.jpg',
                    altText: 'Accessible description',
                }}
                isPreview={true}
            />
        );
        expect(screen.getByText(/Alt text:/)).toBeInTheDocument();
        expect(screen.getByText(/Accessible description/)).toBeInTheDocument();
    });
});
