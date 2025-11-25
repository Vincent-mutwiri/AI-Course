import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VideoBlock } from '../VideoBlock';

describe('VideoBlock', () => {
    it('renders empty state when no video URL provided', () => {
        render(<VideoBlock content={{}} />);
        expect(screen.getByText(/No video configured/i)).toBeInTheDocument();
    });

    it('renders YouTube video iframe', () => {
        render(
            <VideoBlock
                content={{
                    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    videoProvider: 'youtube',
                    title: 'Test Video',
                }}
            />
        );
        const iframe = screen.getByTitle('Test Video');
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
    });

    it('renders Vimeo video iframe', () => {
        render(
            <VideoBlock
                content={{
                    videoUrl: 'https://vimeo.com/123456789',
                    videoProvider: 'vimeo',
                    title: 'Vimeo Video',
                }}
            />
        );
        const iframe = screen.getByTitle('Vimeo Video');
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute('src', 'https://player.vimeo.com/video/123456789');
    });

    it('renders S3 video element', () => {
        const { container } = render(
            <VideoBlock
                content={{
                    videoUrl: 'https://s3.amazonaws.com/bucket/video.mp4',
                    videoProvider: 's3',
                }}
            />
        );
        const video = container.querySelector('video');
        expect(video).toBeInTheDocument();
        expect(video).toHaveAttribute('src', 'https://s3.amazonaws.com/bucket/video.mp4');
    });

    it('renders preview thumbnail in preview mode', () => {
        render(
            <VideoBlock
                content={{
                    videoUrl: 'https://example.com/video.mp4',
                    title: 'Preview Video',
                }}
                isPreview={true}
            />
        );
        expect(screen.getByText('Preview Video')).toBeInTheDocument();
    });
});
