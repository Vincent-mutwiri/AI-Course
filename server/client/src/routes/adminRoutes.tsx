import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageEditorContainer from '../components/admin/PageEditor/PageEditorContainer';
import NavigationGuard from '../components/common/NavigationGuard';

/**
 * Admin routes for the page builder
 * Includes routes for creating and editing pages with navigation guards
 */
const AdminPageRoutes: React.FC = () => {
    return (
        <Routes>
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

            {/* Redirect /admin/pages to pages list (to be implemented in task 11) */}
            <Route
                path="/admin/pages"
                element={<div>Pages List - To be implemented in task 11</div>}
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/admin/pages" replace />} />
        </Routes>
    );
};

export default AdminPageRoutes;
