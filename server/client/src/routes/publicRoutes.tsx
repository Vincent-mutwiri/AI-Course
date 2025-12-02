import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PageRenderer from '../components/PageRenderer';

/**
 * Public routes for page rendering
 * Renders published pages accessible to all users
 * Unpublished pages are only visible to admins
 */
const PublicPageRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Render page by slug */}
            <Route path="/:slug" element={<PageRenderer />} />
        </Routes>
    );
};

export default PublicPageRoutes;
