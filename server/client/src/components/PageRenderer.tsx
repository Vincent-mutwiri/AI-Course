import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IPage } from '../types/page';
import BlockRenderer from './admin/PageEditor/BlockRenderer';
import './PageRenderer.css';

/**
 * PageRenderer component fetches and renders published pages for end users
 * Handles page not found errors and unpublished pages (admin-only access)
 */
const PageRenderer: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [page, setPage] = useState<IPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchPage = async () => {
            if (!slug) {
                setError('Page not found');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Fetch page by slug
                const response = await fetch(`/api/pages/${slug}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.status === 404) {
                    setError('Page not found');
                    setLoading(false);
                    return;
                }

                if (response.status === 403) {
                    setError('This page is not published yet');
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch page');
                }

                const data = await response.json();
                setPage(data.page);
                setIsAdmin(data.isAdmin || false);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching page:', err);
                setError('Failed to load page');
                setLoading(false);
            }
        };

        fetchPage();
    }, [slug]);

    if (loading) {
        return (
            <div className="page-renderer-container">
                <div className="page-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading page...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-renderer-container">
                <div className="page-error">
                    <h1>404</h1>
                    <p>{error}</p>
                    <button onClick={() => navigate('/')} className="back-home-btn">
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    if (!page) {
        return (
            <div className="page-renderer-container">
                <div className="page-error">
                    <h1>404</h1>
                    <p>Page not found</p>
                    <button onClick={() => navigate('/')} className="back-home-btn">
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    // Show unpublished indicator for admins
    const showUnpublishedBanner = isAdmin && !page.isPublished;

    return (
        <div className="page-renderer-container">
            {showUnpublishedBanner && (
                <div className="unpublished-banner">
                    <span>⚠️ This page is unpublished and only visible to administrators</span>
                </div>
            )}

            <article className="page-content">
                <header className="page-header">
                    <h1 className="page-title">{page.title}</h1>
                    {page.type === 'blog' && page.createdAt && (
                        <time className="page-date">
                            {new Date(page.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                    )}
                </header>

                <div className="page-blocks">
                    {page.content.blocks
                        .sort((a, b) => a.order - b.order)
                        .map((block) => (
                            <div key={block.id} className="block-wrapper">
                                <BlockRenderer block={block} isPreview={false} />
                            </div>
                        ))}
                </div>
            </article>
        </div>
    );
};

export default PageRenderer;
