# Design Document: Edulimika Landing Page with Multi-Site Architecture

## Overview

This design implements a dedicated landing page for Edulimika company while establishing a multi-site architecture that allows the same codebase to serve multiple branded sites. The solution uses environment-based configuration for site-specific customization, enabling deployment to multiple domains (Vercel for frontend, Render for backend) without code duplication.

The architecture maintains a single source of truth for shared functionality while providing flexibility for site-specific branding, content, and features through configuration-driven rendering.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Single Repository                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │   Frontend Code  │         │   Backend Code   │          │
│  │                  │         │                  │          │
│  │  - Shared Comps  │         │  - Shared API    │          │
│  │  - Site Configs  │         │  - Env-based     │          │
│  │  - Landing Pages │         │    Config        │          │
│  └──────────────────┘         └──────────────────┘          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ Deploy
                        ▼
        ┌───────────────────────────────┐
        │                               │
        ▼                               ▼
┌──────────────┐              ┌──────────────┐
│   Vercel     │              │   Render     │
│              │              │              │
│ Site A       │◄─────────────┤   Backend    │
│ (domain-a)   │   API Calls  │   (Shared)   │
│              │              │              │
│ Site B       │◄─────────────┤              │
│ (domain-b)   │   API Calls  │              │
└──────────────┘              └──────────────┘
```

### Multi-Site Configuration Strategy

**Environment-Based Site Detection:**
- Each Vercel deployment has a `VITE_SITE_NAME` environment variable
- Site configuration is loaded at build time based on this variable
- Runtime domain detection provides fallback for dynamic routing

**Configuration Hierarchy:**
1. Build-time environment variables (primary)
2. Runtime domain detection (fallback)
3. Default configuration (safety net)

## Components and Interfaces

### 1. Site Configuration System

**File: `src/config/sites.ts`**

```typescript
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

export interface CompanyInfo {
  name: string;
  description: string;
  areasOfWork: Area[];
  partners: Partner[];
  images: string[];
  whyWorkWithUs: Reason[];
  featuredCourses: string[]; // Course IDs
}

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

// Site configurations
export const SITE_CONFIGS: Record<string, SiteConfig> = {
  default: {
    name: 'default',
    displayName: 'Learning Platform',
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
        description: 'Transforming education through innovative learning solutions...',
        areasOfWork: [
          {
            title: 'Instructional Design',
            description: 'Creating engaging, evidence-based learning experiences',
            icon: 'BookOpen'
          },
          {
            title: 'EdTech Development',
            description: 'Building cutting-edge educational technology platforms',
            icon: 'Code'
          },
          {
            title: 'Learning Analytics',
            description: 'Data-driven insights for improved learning outcomes',
            icon: 'BarChart'
          },
          {
            title: 'Teacher Training',
            description: 'Professional development for educators',
            icon: 'Users'
          }
        ],
        partners: [
          {
            name: 'Partner Organization 1',
            logo: '/partners/partner1.png',
            description: 'Collaboration description',
            website: 'https://partner1.com'
          }
        ],
        images: [
          '/edulimika/hero-1.jpg',
          '/edulimika/team-1.jpg',
          '/edulimika/impact-1.jpg'
        ],
        whyWorkWithUs: [
          {
            title: 'Proven Expertise',
            description: 'Years of experience in educational technology',
            icon: 'Award'
          },
          {
            title: 'Innovative Solutions',
            description: 'Cutting-edge approaches to learning challenges',
            icon: 'Lightbulb'
          },
          {
            title: 'Measurable Results',
            description: 'Data-driven outcomes and continuous improvement',
            icon: 'TrendingUp'
          }
        ],
        featuredCourses: ['course-id-1', 'course-id-2', 'course-id-3']
      }
    }
  }
};

// Get current site configuration
export function getSiteConfig(): SiteConfig {
  const siteName = import.meta.env.VITE_SITE_NAME || 'default';
  return SITE_CONFIGS[siteName] || SITE_CONFIGS.default;
}

// Runtime domain detection (fallback)
export function detectSiteFromDomain(hostname: string): SiteConfig {
  const site = Object.values(SITE_CONFIGS).find(
    config => config.domain === hostname
  );
  return site || SITE_CONFIGS.default;
}
```

### 2. Edulimika Landing Page Component

**File: `src/pages/EdulimikaLandingPage.tsx`**

```typescript
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getSiteConfig } from '@/config/sites';
import { 
  BookOpen, Code, BarChart, Users, Award, 
  Lightbulb, TrendingUp, ArrowRight, ExternalLink 
} from 'lucide-react';

// Icon mapping
const iconMap = {
  BookOpen, Code, BarChart, Users, Award,
  Lightbulb, TrendingUp, ArrowRight, ExternalLink
};

export default function EdulimikaLandingPage() {
  const siteConfig = getSiteConfig();
  const companyInfo = siteConfig.content.companyInfo;

  if (!companyInfo) {
    return <div>Configuration error</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection companyInfo={companyInfo} theme={siteConfig.theme} />
      
      {/* Areas of Work */}
      <AreasSection areas={companyInfo.areasOfWork} />
      
      {/* Partners */}
      <PartnersSection partners={companyInfo.partners} />
      
      {/* Image Gallery */}
      <ImageGallery images={companyInfo.images} />
      
      {/* Why Work With Us */}
      <WhyWorkWithUsSection reasons={companyInfo.whyWorkWithUs} />
      
      {/* Featured Courses */}
      <FeaturedCoursesSection courseIds={companyInfo.featuredCourses} />
      
      {/* CTA Section */}
      <CTASection theme={siteConfig.theme} />
    </div>
  );
}

// Sub-components for each section...
```

### 3. Site-Aware Router

**File: `src/App.tsx` (Modified)**

```typescript
import { getSiteConfig } from '@/config/sites';
import HomePage from './pages/HomePage';
import EdulimikaLandingPage from './pages/EdulimikaLandingPage';

function App() {
  const siteConfig = getSiteConfig();
  
  // Determine landing page component
  const LandingPage = siteConfig.content.landingPage === 'EdulimikaLandingPage' 
    ? EdulimikaLandingPage 
    : HomePage;

  return (
    <>
      <Toaster {...toasterConfig} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          {/* Rest of routes remain the same */}
        </Route>
      </Routes>
    </>
  );
}
```

### 4. Theme Provider

**File: `src/contexts/ThemeContext.tsx`**

```typescript
import { createContext, useContext, ReactNode } from 'react';
import { getSiteConfig } from '@/config/sites';

interface ThemeContextType {
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  siteName: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const siteConfig = getSiteConfig();
  
  const theme: ThemeContextType = {
    primaryColor: siteConfig.theme.primaryColor,
    secondaryColor: siteConfig.theme.secondaryColor,
    logo: siteConfig.theme.logo,
    siteName: siteConfig.displayName
  };

  // Apply CSS variables for theming
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### 5. Backend CORS Configuration

**File: `server/src/index.ts` (Modified)**

```typescript
import cors from 'cors';

// Multi-site CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL_1 || 'http://localhost:5173',
  process.env.FRONTEND_URL_2,
  process.env.FRONTEND_URL_3,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

## Data Models

### Site Configuration Schema

The site configuration is stored in code (not database) for build-time optimization. However, dynamic content (courses, partners) is fetched from the database.

### Course Model (Existing)

No changes required. The landing page will query existing course data.

### Partner Model (New - Optional)

If partners need to be managed dynamically:

```typescript
interface Partner {
  _id: string;
  name: string;
  logo: string;
  description: string;
  website?: string;
  active: boolean;
  displayOrder: number;
  sites: string[]; // Which sites to show on
}
```

## Error Handling

### Configuration Errors

```typescript
// Graceful fallback for missing configuration
export function getSiteConfig(): SiteConfig {
  try {
    const siteName = import.meta.env.VITE_SITE_NAME || 'default';
    const config = SITE_CONFIGS[siteName];
    
    if (!config) {
      console.warn(`Site config not found for: ${siteName}, using default`);
      return SITE_CONFIGS.default;
    }
    
    return config;
  } catch (error) {
    console.error('Error loading site config:', error);
    return SITE_CONFIGS.default;
  }
}
```

### Missing Content Handling

```typescript
// Component-level error boundaries
function AreasSection({ areas }: { areas?: Area[] }) {
  if (!areas || areas.length === 0) {
    return null; // Gracefully hide section if no content
  }
  
  return (
    <section>
      {/* Render areas */}
    </section>
  );
}
```

### API Error Handling

```typescript
// Fetch featured courses with error handling
async function fetchFeaturedCourses(courseIds: string[]) {
  try {
    const courses = await Promise.all(
      courseIds.map(id => api.get(`/courses/${id}`))
    );
    return courses.filter(Boolean); // Filter out failed requests
  } catch (error) {
    console.error('Error fetching courses:', error);
    return []; // Return empty array on error
  }
}
```

## Testing Strategy

### Unit Tests

1. **Site Configuration Tests**
   - Test `getSiteConfig()` returns correct config for each site
   - Test fallback to default configuration
   - Test domain detection logic

2. **Component Tests**
   - Test landing page renders with valid configuration
   - Test graceful handling of missing content
   - Test responsive behavior

3. **Theme Tests**
   - Test theme provider applies correct CSS variables
   - Test theme switching between sites

### Integration Tests

1. **Routing Tests**
   - Test correct landing page loads for each site
   - Test shared routes work across all sites
   - Test navigation between pages

2. **API Tests**
   - Test CORS allows requests from all configured origins
   - Test backend serves data correctly regardless of origin
   - Test environment variable configuration

### E2E Tests

1. **Multi-Site Deployment Tests**
   - Test each Vercel deployment loads correct site
   - Test domain mapping works correctly
   - Test environment variables are applied

2. **User Flow Tests**
   - Test visitor can navigate Edulimika landing page
   - Test visitor can view courses and enroll
   - Test authentication works across sites

## Deployment Architecture

### Vercel Deployment Strategy

**Option 1: Multiple Projects (Recommended)**

```
Repository: single-repo
├── Vercel Project 1: "edulimika-site"
│   ├── Domain: edulimika.com
│   ├── Env: VITE_SITE_NAME=edulimika
│   └── Env: VITE_API_URL=https://api.render.com
│
└── Vercel Project 2: "default-site"
    ├── Domain: learning-platform.com
    ├── Env: VITE_SITE_NAME=default
    └── Env: VITE_API_URL=https://api.render.com
```

**Option 2: Single Project with Domain Detection**

```
Repository: single-repo
└── Vercel Project: "multi-site"
    ├── Domain 1: edulimika.com
    ├── Domain 2: learning-platform.com
    └── Runtime domain detection determines site
```

### Render Deployment

**Single Backend Service:**

```yaml
services:
  - type: web
    name: multi-site-api
    runtime: node
    buildCommand: cd server && npm install && npm run build
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: FRONTEND_URL_1
        value: https://edulimika.com
      - key: FRONTEND_URL_2
        value: https://learning-platform.com
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
```

### Environment Variables Configuration

**Vercel (Per Project):**
```
VITE_SITE_NAME=edulimika
VITE_API_URL=https://multi-site-api.onrender.com
VITE_ENABLE_ANALYTICS=true
```

**Render (Single Service):**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=<connection-string>
JWT_SECRET=<secret>
FRONTEND_URL_1=https://edulimika.com
FRONTEND_URL_2=https://learning-platform.com
FRONTEND_URL_3=https://preview-*.vercel.app
```

### Build and Deploy Process

**Frontend (Vercel):**
1. Push to repository triggers webhook
2. Vercel builds with project-specific env vars
3. Build-time site configuration is embedded
4. Static assets deployed to CDN
5. Domain mapped to deployment

**Backend (Render):**
1. Push to repository triggers webhook
2. Render builds server code
3. Environment variables loaded from Render dashboard
4. Service starts and accepts requests from all configured origins

## Performance Considerations

### Build Optimization

- Site-specific code splitting to reduce bundle size
- Lazy loading of site-specific components
- Shared components cached across builds

### Runtime Optimization

- Site configuration loaded once at app initialization
- CSS variables for theming (no runtime style recalculation)
- Image optimization with responsive images
- CDN caching for static assets

### Caching Strategy

```typescript
// Cache site configuration
let cachedConfig: SiteConfig | null = null;

export function getSiteConfig(): SiteConfig {
  if (cachedConfig) return cachedConfig;
  
  const siteName = import.meta.env.VITE_SITE_NAME || 'default';
  cachedConfig = SITE_CONFIGS[siteName] || SITE_CONFIGS.default;
  
  return cachedConfig;
}
```

## Security Considerations

### CORS Configuration

- Whitelist only known frontend domains
- Reject requests from unknown origins
- Support preview deployments with wildcard patterns

### Environment Variables

- Never expose sensitive keys in frontend
- Use Vercel/Render secret management
- Rotate secrets regularly

### Content Security

- Validate all user-uploaded images
- Sanitize partner/company descriptions
- Implement rate limiting on API endpoints

## Accessibility

### WCAG 2.1 Level AA Compliance

- Semantic HTML structure
- Proper heading hierarchy
- Alt text for all images
- Keyboard navigation support
- Color contrast ratios meet standards
- Focus indicators visible
- Screen reader friendly

### Responsive Design

- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1440px
- Touch-friendly interactive elements
- Readable font sizes across devices

## Migration Path

### Phase 1: Setup Infrastructure
- Create site configuration system
- Implement theme provider
- Update CORS configuration

### Phase 2: Build Edulimika Landing Page
- Create landing page component
- Add company content
- Implement responsive design

### Phase 3: Deploy Multi-Site
- Configure Vercel projects
- Set up environment variables
- Deploy and test both sites

### Phase 4: Optimize and Monitor
- Implement analytics
- Monitor performance
- Gather user feedback
