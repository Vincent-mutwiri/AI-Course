import React from 'react';
import { useParams } from 'react-router-dom';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import PageEditorContainer from '@/components/admin/PageEditor/PageEditorContainer';

const PageEditorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // If no ID is provided (route is /pages/new) or ID is explicitly 'new', it's a new page
    const isNewPage = !id || id === 'new';

    return (
        <ErrorBoundary>
            <PageEditorContainer isNewPage={isNewPage} />
        </ErrorBoundary>
    );
};

export default PageEditorPage;
