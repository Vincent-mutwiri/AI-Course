import React, { useState, useEffect, useCallback } from 'react';
import { IPage } from '@/types/page';
import { debounce } from '@/utils/debounce';

interface PageMetadataFormProps {
    page: IPage;
    onChange: (updates: Partial<IPage>) => void;
    onValidationChange?: (isValid: boolean) => void;
}

interface ValidationErrors {
    title?: string;
    slug?: string;
}

const PageMetadataForm: React.FC<PageMetadataFormProps> = ({ page, onChange, onValidationChange }) => {
    const [localPage, setLocalPage] = useState<IPage>(page);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isValidatingSlug, setIsValidatingSlug] = useState(false);
    const [slugManuallySet, setSlugManuallySet] = useState(false);

    // Update local state when page prop changes
    useEffect(() => {
        setLocalPage(page);
    }, [page]);

    // Auto-generate slug from title
    const generateSlug = (title: string): string => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    };

    // Validate slug uniqueness
    const validateSlugUniqueness = useCallback(
        debounce(async (slug: string, pageId?: string) => {
            if (!slug) {
                setErrors(prev => ({ ...prev, slug: 'Slug is required' }));
                setIsValidatingSlug(false);
                return;
            }

            setIsValidatingSlug(true);

            try {
                const params = new URLSearchParams({ slug });
                if (pageId) {
                    params.append('excludeId', pageId);
                }

                const response = await fetch(`/api/admin/pages/validate-slug?${params}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to validate slug');
                }

                const data = await response.json();

                if (!data.isUnique) {
                    setErrors(prev => ({
                        ...prev,
                        slug: 'This slug is already in use. Please choose a different one.'
                    }));
                } else {
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.slug;
                        return newErrors;
                    });
                }
            } catch (error) {
                console.error('Error validating slug:', error);
                setErrors(prev => ({
                    ...prev,
                    slug: 'Failed to validate slug uniqueness'
                }));
            } finally {
                setIsValidatingSlug(false);
            }
        }, 500),
        []
    );

    // Handle title change
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;

        // Clear title error
        if (errors.title) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.title;
                return newErrors;
            });
        }

        // Auto-generate slug if not manually set
        let updates: Partial<IPage> = { title: newTitle };
        if (!slugManuallySet && newTitle) {
            const newSlug = generateSlug(newTitle);
            updates.slug = newSlug;
            setLocalPage(prev => ({ ...prev, ...updates }));
            validateSlugUniqueness(newSlug, page._id);
        } else {
            setLocalPage(prev => ({ ...prev, title: newTitle }));
        }

        onChange(updates);
    };

    // Handle slug change
    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSlug = e.target.value;
        setSlugManuallySet(true);

        // Validate slug format (URL-safe)
        const urlSafeRegex = /^[a-z0-9-_]*$/;
        if (newSlug && !urlSafeRegex.test(newSlug)) {
            setErrors(prev => ({
                ...prev,
                slug: 'Slug can only contain lowercase letters, numbers, hyphens, and underscores'
            }));
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.slug;
                return newErrors;
            });
        }

        setLocalPage(prev => ({ ...prev, slug: newSlug }));
        onChange({ slug: newSlug });
    };

    // Handle slug blur (validate uniqueness)
    const handleSlugBlur = () => {
        if (localPage.slug) {
            validateSlugUniqueness(localPage.slug, page._id);
        }
    };

    // Handle type change
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as 'blog' | 'page' | 'home';
        setLocalPage(prev => ({ ...prev, type: newType }));
        onChange({ type: newType });
    };

    // Handle publish status change
    const handlePublishChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isPublished = e.target.checked;
        setLocalPage(prev => ({ ...prev, isPublished }));
        onChange({ isPublished });
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!localPage.title || localPage.title.trim() === '') {
            newErrors.title = 'Title is required';
        }

        if (!localPage.slug || localPage.slug.trim() === '') {
            newErrors.slug = 'Slug is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Check if form has errors
    const hasErrors = Object.keys(errors).length > 0;

    // Notify parent of validation state changes
    useEffect(() => {
        const isValid = !hasErrors &&
            !isValidatingSlug &&
            localPage.title?.trim() !== '' &&
            localPage.slug?.trim() !== '';

        if (onValidationChange) {
            onValidationChange(isValid);
        }
    }, [hasErrors, isValidatingSlug, localPage.title, localPage.slug, onValidationChange]);

    return (
        <div className="page-metadata-form">
            <h2>Page Information</h2>

            <div className="form-group">
                <label htmlFor="page-title">
                    Title <span className="required">*</span>
                </label>
                <input
                    id="page-title"
                    type="text"
                    value={localPage.title}
                    onChange={handleTitleChange}
                    placeholder="Enter page title"
                    className={errors.title ? 'error' : ''}
                />
                {errors.title && (
                    <span className="error-message">{errors.title}</span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="page-slug">
                    Slug <span className="required">*</span>
                    {isValidatingSlug && <span className="validating"> (Validating...)</span>}
                </label>
                <input
                    id="page-slug"
                    type="text"
                    value={localPage.slug}
                    onChange={handleSlugChange}
                    onBlur={handleSlugBlur}
                    placeholder="page-url-slug"
                    className={errors.slug ? 'error' : ''}
                />
                <small className="help-text">
                    URL-safe identifier (lowercase letters, numbers, hyphens, underscores only)
                </small>
                {errors.slug && (
                    <span className="error-message">{errors.slug}</span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="page-type">
                    Page Type
                </label>
                <select
                    id="page-type"
                    value={localPage.type}
                    onChange={handleTypeChange}
                >
                    <option value="page">Page</option>
                    <option value="blog">Blog Post</option>
                    <option value="home">Home Page</option>
                </select>
                <small className="help-text">
                    Select the type of page you're creating
                </small>
            </div>

            <div className="form-group checkbox-group">
                <label htmlFor="page-published">
                    <input
                        id="page-published"
                        type="checkbox"
                        checked={localPage.isPublished}
                        onChange={handlePublishChange}
                    />
                    <span>Published</span>
                </label>
                <small className="help-text">
                    {localPage.isPublished
                        ? 'This page is visible to all users'
                        : 'This page is only visible to administrators'}
                </small>
            </div>

            {hasErrors && (
                <div className="form-validation-summary error">
                    Please fix the errors above before saving
                </div>
            )}
        </div>
    );
};

export default PageMetadataForm;
