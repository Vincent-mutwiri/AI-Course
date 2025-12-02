import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IPage } from '../../../types/page';
import './PagesList.css';

const PagesListContainer: React.FC = () => {
    const navigate = useNavigate();
    const [pages, setPages] = useState<IPage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'published' | 'unpublished'>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Fetch pages on mount
    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/pages', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch pages');
            }

            const data = await response.json();
            setPages(data.pages || []);
        } catch (err) {
            console.error('Error fetching pages:', err);
            setError('Failed to load pages');
        } finally {
            setLoading(false);
        }
    };

    // Filter and search pages
    const filteredPages = pages
        .filter(page => {
            // Apply publish status filter
            if (filter === 'published' && !page.isPublished) return false;
            if (filter === 'unpublished' && page.isPublished) return false;

            // Apply search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    page.title.toLowerCase().includes(query) ||
                    page.slug.toLowerCase().includes(query)
                );
            }

            return true;
        })
        .sort((a, b) => {
            // Sort by updatedAt descending (most recent first)
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });

    const handleRowClick = (pageId: string) => {
        navigate(`/admin/pages/${pageId}/edit`);
    };

    const handleCreateNew = () => {
        navigate('/admin/pages/new');
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="pages-list-container">
                <div className="loading-state">Loading pages...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pages-list-container">
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={fetchPages} className="retry-button">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pages-list-container">
            <div className="pages-list-header">
                <h1>Pages</h1>
                <button onClick={handleCreateNew} className="create-page-button">
                    + Create New Page
                </button>
            </div>

            <div className="pages-list-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by title or slug..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-controls">
                    <label htmlFor="status-filter">Status:</label>
                    <select
                        id="status-filter"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'published' | 'unpublished')}
                        className="filter-select"
                    >
                        <option value="all">All Pages</option>
                        <option value="published">Published</option>
                        <option value="unpublished">Unpublished</option>
                    </select>
                </div>
            </div>

            {filteredPages.length === 0 ? (
                <div className="empty-state">
                    <p>No pages found</p>
                    {searchQuery || filter !== 'all' ? (
                        <p className="empty-state-hint">Try adjusting your filters or search query</p>
                    ) : (
                        <button onClick={handleCreateNew} className="create-page-button-secondary">
                            Create your first page
                        </button>
                    )}
                </div>
            ) : (
                <div className="pages-table-wrapper">
                    <table className="pages-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Slug</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPages.map((page) => (
                                <tr
                                    key={page._id}
                                    onClick={() => handleRowClick(page._id)}
                                    className="page-row"
                                >
                                    <td className="page-title">{page.title || 'Untitled'}</td>
                                    <td className="page-slug">/{page.slug}</td>
                                    <td className="page-type">
                                        <span className={`type-badge type-${page.type}`}>
                                            {page.type}
                                        </span>
                                    </td>
                                    <td className="page-status">
                                        <span className={`status-badge ${page.isPublished ? 'published' : 'unpublished'}`}>
                                            {page.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="page-updated">{formatDate(page.updatedAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="pages-list-footer">
                <p className="pages-count">
                    Showing {filteredPages.length} of {pages.length} page{pages.length !== 1 ? 's' : ''}
                </p>
            </div>
        </div>
    );
};

export default PagesListContainer;
