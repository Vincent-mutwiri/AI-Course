/**
 * Site Configuration System
 * 
 * This module provides multi-site architecture support through environment-based configuration.
 * Each site can have its own branding, theme, features, and content while sharing the same codebase.
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface Area {
    title: string;
    description: string;
    icon: string;
}

export interface Partner {
    name: string;
    logo: string;
    description: string;
    website?: string;
}

export interface Reason {
    title: string;
    description: string;
    icon: string;
}

export interface CompanyInfo {
    name: string;
    description: string;
    areasOfWork: Area[];
    partners: Partner[];
    images: string[];
    whyWorkWithUs: Reason[];
    featuredCourses: string[]; // Course IDs
}

export interface SiteConfig {
    name: string;
    displayName: string;
    domain: string;
    theme: {
        primaryColor: string;
        secondaryColor: string;
        logo: string;
    };
    features: {
        showLandingPage: boolean;
        enableCourses: boolean;
        enableAuth: boolean;
    };
    content: {
        landingPage: string; // Component name to render
        companyInfo?: CompanyInfo;
    };
}

// ============================================================================
// Site Configurations
// ============================================================================

export const SITE_CONFIGS: Record<string, SiteConfig> = {
    default: {
        name: 'default',
        displayName: 'Edulimika',
        domain: 'localhost:5173',
        theme: {
            primaryColor: '#3B82F6',
            secondaryColor: '#8B5CF6',
            logo: '/logo-default.png'
        },
        features: {
            showLandingPage: false,
            enableCourses: true,
            enableAuth: true
        },
        content: {
            landingPage: 'HomePage'
        }
    },
    edulimika: {
        name: 'edulimika',
        displayName: 'Edulimika',
        domain: 'edulimika.com',
        theme: {
            primaryColor: '#10B981',
            secondaryColor: '#3B82F6',
            logo: '/logo-edulimika.png'
        },
        features: {
            showLandingPage: true,
            enableCourses: true,
            enableAuth: true
        },
        content: {
            landingPage: 'EdulimikaLandingPage',
            companyInfo: {
                name: 'Edulimika',
                description: 'Transforming education through innovative learning solutions and cutting-edge educational technology. We partner with organizations to create engaging, evidence-based learning experiences that drive measurable results.',
                areasOfWork: [
                    {
                        title: 'Instructional Design',
                        description: 'Creating engaging, evidence-based learning experiences that maximize knowledge retention and learner engagement through proven pedagogical approaches.',
                        icon: 'BookOpen'
                    },
                    {
                        title: 'EdTech Development',
                        description: 'Building cutting-edge educational technology platforms that scale learning and provide seamless user experiences across devices.',
                        icon: 'Code'
                    },
                    {
                        title: 'Learning Analytics',
                        description: 'Data-driven insights for improved learning outcomes through comprehensive analytics and actionable reporting.',
                        icon: 'BarChart'
                    },
                    {
                        title: 'Teacher Training',
                        description: 'Professional development programs for educators that enhance teaching effectiveness and integrate modern pedagogical methods.',
                        icon: 'Users'
                    }
                ],
                partners: [
                    {
                        name: 'Educational Institution Partner',
                        logo: '/partners/partner1.png',
                        description: 'Collaborating to deliver innovative learning solutions to thousands of students worldwide.',
                        website: 'https://example.com'
                    },
                    {
                        name: 'Technology Partner',
                        logo: '/partners/partner2.png',
                        description: 'Working together to build next-generation educational technology platforms.',
                        website: 'https://example.com'
                    },
                    {
                        name: 'Research Partner',
                        logo: '/partners/partner3.png',
                        description: 'Conducting research on learning science and evidence-based instructional design.',
                        website: 'https://example.com'
                    }
                ],
                images: [
                    '/edulimika/hero-1.jpg',
                    '/edulimika/team-1.jpg',
                    '/edulimika/impact-1.jpg',
                    '/edulimika/classroom-1.jpg',
                    '/edulimika/technology-1.jpg',
                    '/edulimika/collaboration-1.jpg'
                ],
                whyWorkWithUs: [
                    {
                        title: 'Proven Expertise',
                        description: 'Years of experience in educational technology and instructional design with a track record of successful implementations.',
                        icon: 'Award'
                    },
                    {
                        title: 'Innovative Solutions',
                        description: 'Cutting-edge approaches to learning challenges that leverage the latest research and technology.',
                        icon: 'Lightbulb'
                    },
                    {
                        title: 'Measurable Results',
                        description: 'Data-driven outcomes and continuous improvement through comprehensive analytics and feedback loops.',
                        icon: 'TrendingUp'
                    },
                    {
                        title: 'Collaborative Approach',
                        description: 'Working closely with your team to understand needs and deliver customized solutions that fit your context.',
                        icon: 'Users'
                    }
                ],
                featuredCourses: [] // Will be populated with actual course IDs
            }
        }
    }
};

// ============================================================================
// Configuration Access Functions
// ============================================================================

// Cache for site configuration to avoid repeated lookups
let cachedConfig: SiteConfig | null = null;

/**
 * Get the current site configuration based on environment variables.
 * Uses VITE_SITE_NAME environment variable to determine which site config to load.
 * Falls back to 'default' configuration if not specified or not found.
 * 
 * @returns {SiteConfig} The site configuration object
 */
export function getSiteConfig(): SiteConfig {
    // Return cached config if available
    if (cachedConfig) {
        return cachedConfig;
    }

    try {
        // Get site name from environment variable (set at build time)
        const siteName = import.meta.env.VITE_SITE_NAME || 'default';

        // Look up configuration
        const config = SITE_CONFIGS[siteName];

        if (!config) {
            console.warn(`Site configuration not found for: ${siteName}, using default configuration`);
            cachedConfig = SITE_CONFIGS.default;
            return cachedConfig;
        }

        // Cache and return the configuration
        cachedConfig = config;
        return cachedConfig;
    } catch (error) {
        console.error('Error loading site configuration:', error);
        // Return default configuration as fallback
        cachedConfig = SITE_CONFIGS.default;
        return cachedConfig;
    }
}

/**
 * Detect site configuration from the current domain/hostname.
 * This provides a runtime fallback for domain-based routing.
 * 
 * @param {string} hostname - The hostname to match against site configurations
 * @returns {SiteConfig} The matching site configuration or default
 */
export function detectSiteFromDomain(hostname: string): SiteConfig {
    try {
        // Find site configuration matching the hostname
        const site = Object.values(SITE_CONFIGS).find(
            config => config.domain === hostname || hostname.includes(config.domain)
        );

        if (site) {
            console.log(`Detected site from domain ${hostname}: ${site.name}`);
            return site;
        }

        console.warn(`No site configuration found for domain: ${hostname}, using default`);
        return SITE_CONFIGS.default;
    } catch (error) {
        console.error('Error detecting site from domain:', error);
        return SITE_CONFIGS.default;
    }
}

/**
 * Clear the cached configuration.
 * Useful for testing or when configuration needs to be reloaded.
 */
export function clearConfigCache(): void {
    cachedConfig = null;
}
