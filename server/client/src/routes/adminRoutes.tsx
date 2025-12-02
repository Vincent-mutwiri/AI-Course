import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageEditorContainer from '../components/admin/PageEditor/PageEditorContainer';
import { PagesListContainer } from '../components/admin/PagesList';
import NavigationGuard from '../components/common/NavigationGuard';

/**
 * Admin routes for the page builder
 * Includes routes for creating and editing pages with navigation guards
 */
const AdminPageRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Pages list */}
            <Route
                path="/admin/pages"
                element={<PagesListContainer />}
            />

            {/* Create new page */}
            <Route
                path="/admin/pages/new"
                element={
                    <NavigationGuard>
                        <PageEditorContainer isNewPage={true} />
                    </NavigationGuard>
                }
            />

            {/* Edit existing page */}
            <Route
                path="/admin/pages/:id/edit"
                element={
                    <NavigationGuard>
                        <PageEditorContainer isNewPage={false} />
                    </NavigationGuard>
                }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/admin/pages" replace />} />
        </Routes>
    );
};

export default AdminPageRoutes;
