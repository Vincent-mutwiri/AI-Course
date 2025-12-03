/**
 * Theme Context Provider
 * 
 * Provides site-specific theming throughout the application using React Context.
 * Applies theme colors as CSS variables for dynamic styling.
 */

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { getSiteConfig } from '@/config/sites';

// ============================================================================
// Type Definitions
// ============================================================================

interface ThemeContextType {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    siteName: string;
    displayName: string;
}

// ============================================================================
// Context Creation
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================================
// Theme Provider Component
// ============================================================================

interface ThemeProviderProps {
    children: ReactNode;
}

/**
 * ThemeProvider component that wraps the application and provides theme context.
 * Automatically applies theme colors as CSS variables to the document root.
 * 
 * @param {ThemeProviderProps} props - Component props
 * @returns {JSX.Element} Provider component
 */
export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
    const siteConfig = getSiteConfig();

    const theme: ThemeContextType = {
        primaryColor: siteConfig.theme.primaryColor,
        secondaryColor: siteConfig.theme.secondaryColor,
        logo: siteConfig.theme.logo,
        siteName: siteConfig.name,
        displayName: siteConfig.displayName
    };

    // Apply CSS variables for theming on mount and when theme changes
    useEffect(() => {
        const root = document.documentElement;

        // Set CSS custom properties for theme colors
        root.style.setProperty('--primary-color', theme.primaryColor);
        root.style.setProperty('--secondary-color', theme.secondaryColor);

        // Set data attribute for site name (useful for site-specific CSS)
        root.setAttribute('data-site', theme.siteName);

        // Update document title with site display name
        document.title = theme.displayName;

        console.log(`Theme applied for site: ${theme.siteName}`);
    }, [theme.primaryColor, theme.secondaryColor, theme.siteName, theme.displayName]);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
}

// ============================================================================
// Custom Hook
// ============================================================================

/**
 * Custom hook to access theme context.
 * Must be used within a ThemeProvider.
 * 
 * @returns {ThemeContextType} The current theme configuration
 * @throws {Error} If used outside of ThemeProvider
 */
export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}

// ============================================================================
// Exports
// ============================================================================

export type { ThemeContextType };
