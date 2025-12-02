/**
 * Route exports for the Admin Page Builder
 * 
 * Usage in main app:
 * 
 * import { AdminPageRoutes, PublicPageRoutes } from './routes';
 * 
 * // In your main router:
 * <BrowserRouter>
 *   <Routes>
 *     <Route path="/admin/*" element={<AdminPageRoutes />} />
 *     <Route path="/*" element={<PublicPageRoutes />} />
 *   </Routes>
 * </BrowserRouter>
 */

export { default as AdminPageRoutes } from './adminRoutes';
export { default as PublicPageRoutes } from './publicRoutes';
