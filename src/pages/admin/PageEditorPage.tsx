import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { PageEditorContainer } from '@/components/admin/PageEditor';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { pageEditorApi } from '@/services/api';
import type { IPage } from '@/types/page';

const PageEditorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [pageData, setPageData] = useState<IPage | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const isNewPage = id === 'new';

    useEffect(() => {
        const fetchPageData = async () => {
            // If creating a new page, skip fetching
            if (isNewPage) {
                setIsLoading(false);
                return;
            }

            // If no ID provided, show error
            if (!id) {
                setError('No page ID provided');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                const response = await pageEditorApi.getPage(id);
                setPageData(response.page);
            } catch (err: any) {
                console.error('Error fetching page data:', err);

                // Handle different error types
                if (err.response?.status === 404) {
                    setError('Page not found');
                } else if (err.response?.status === 401 || err.response?.status === 403) {
                    setError('You do not have permission to edit this page');
                } else if (err.message === 'Network Error' || !navigator.onLine) {
                    setError('Network error. Please check your connection and try again.');
                } else {
                    setError(err.response?.data?.message || 'Failed to load page data');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchPageData();
    }, [id, isNewPage]);

    // Handle navigation back to page list
    const handleBackToPages = () => {
        navigate('/admin/pages');
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner text="Loading page editor..." size="lg" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <Card className="max-w-md w-full border-red-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            Error Loading Page
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{error}</p>
                        <div className="flex gap-2">
                            <Button onClick={handleBackToPages} variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Pages
                            </Button>
                            <Button onClick={() => window.location.reload()} variant="default">
                                Retry
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Render the page editor wrapped in ErrorBoundary
    return (
        <ErrorBoundary>
            <PageEditorContainer isNewPage={isNewPage} />
        </ErrorBoundary>
    );
};

export default PageEditorPage;
