# Accessibility Implementation Guide

## Overview

The Admin Course Builder has been designed and implemented with accessibility as a core requirement, following WCAG 2.1 AA standards. This document outlines the accessibility features implemented and provides guidance for maintaining accessibility compliance.

## Key Accessibility Features

### 1. Keyboard Navigation

#### Full Keyboard Support
- **Tab Navigation**: All interactive elements are keyboard accessible
- **Arrow Keys**: Navigate through lists (course structure, block library)
- **Enter/Space**: Activate buttons and select items
- **Escape**: Close modals and dialogs
- **Cmd/Ctrl + Z**: Undo operations
- **Cmd/Ctrl + D**: Duplicate selected block

#### Skip Links
- Skip to main content link appears on focus for keyboard users
- Allows users to bypass navigation and go directly to the canvas

#### Focus Management
- Visible focus indicators on all interactive elements
- Focus trap within modals to prevent focus from escaping
- Focus returns to trigger element when closing modals
- Focus moves to first error in forms when validation fails

### 2. ARIA Labels and Roles

#### Semantic HTML and ARIA Roles
- `role="main"` on canvas area
- `role="navigation"` on course structure
- `role="complementary"` on block library
- `role="article"` on individual blocks
- `role="toolbar"` on block action buttons
- `role="list"` and `role="listitem"` for structured content

#### Descriptive Labels
- All buttons have descriptive `aria-label` attributes
- Block types include position information (e.g., "Text block, position 3")
- Action buttons describe both action and target (e.g., "Edit text block, position 3")
- Form fields have associated labels and descriptions

#### Live Regions
- `aria-live="polite"` for save status updates
- `aria-live="assertive"` for error messages
- Screen reader announcements for important state changes

#### State Communication
- `aria-expanded` for collapsible sections
- `aria-current="page"` for active lesson
- `aria-invalid` for form validation errors
- `aria-busy` for loading states
- `aria-disabled` for disabled elements

### 3. Color Contrast

#### WCAG AA Compliance
- All text meets minimum 4.5:1 contrast ratio for normal text
- Large text (18pt+) meets 3:1 contrast ratio
- Interactive elements have sufficient contrast in all states
- Focus indicators have 3:1 contrast with background

#### Color Independence
- Information is not conveyed by color alone
- Icons and text labels accompany color coding
- Error states include text descriptions, not just red borders

### 4. Focus Indicators

#### Visible Focus States
- 2px solid outline on all focusable elements
- Additional ring shadow for enhanced visibility
- Focus indicators visible in both light and dark modes
- Increased outline width (3px) in high contrast mode

#### Focus Within
- Container elements show focus when child elements are focused
- Block cards highlight when action buttons receive focus
- Toolbar becomes visible when any button is focused

### 5. Screen Reader Support

#### Descriptive Content
- All images have alt text
- Decorative icons marked with `aria-hidden="true"`
- Complex interactions have descriptive labels
- Status messages announced to screen readers

#### Semantic Structure
- Proper heading hierarchy (h1 → h2 → h3)
- Landmark regions for page structure
- Lists marked up semantically
- Forms properly labeled and grouped

#### Hidden Content
- `.sr-only` class for screen reader only content
- Visual indicators supplemented with text alternatives
- Loading states announced to screen readers

### 6. Form Accessibility

#### Labels and Descriptions
- All form fields have associated `<label>` elements
- Required fields marked with asterisk and aria-required
- Helper text linked with `aria-describedby`
- Error messages linked to fields with `aria-invalid`

#### Validation
- Client-side validation with clear error messages
- Errors announced to screen readers
- Focus moves to first error on submission
- Inline validation as user types

#### Input Types
- Appropriate input types (text, number, search, etc.)
- Autocomplete attributes where applicable
- Placeholder text as hints, not labels

### 7. Responsive and Mobile Accessibility

#### Touch Targets
- Minimum 44x44px touch targets on mobile
- Adequate spacing between interactive elements
- Larger tap areas for small icons

#### Mobile Navigation
- Accessible mobile menu with proper ARIA attributes
- Overlay dismissible with keyboard
- Focus management in mobile sidebars

### 8. Motion and Animation

#### Reduced Motion Support
- Respects `prefers-reduced-motion` media query
- Animations disabled or reduced for users who prefer less motion
- Essential animations (loading spinners) remain but simplified

### 9. High Contrast Mode

#### Enhanced Visibility
- Borders and outlines visible in high contrast mode
- Focus indicators enhanced (3px width)
- All interactive elements have visible boundaries

## Testing Checklist

### Keyboard Navigation
- [ ] All interactive elements reachable via Tab
- [ ] Tab order is logical and intuitive
- [ ] No keyboard traps
- [ ] Skip link works correctly
- [ ] Keyboard shortcuts function as expected

### Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] All content announced correctly
- [ ] Landmarks properly identified
- [ ] Form labels and errors announced

### Visual Testing
- [ ] Focus indicators visible on all elements
- [ ] Color contrast meets WCAG AA standards
- [ ] Text remains readable at 200% zoom
- [ ] No information conveyed by color alone
- [ ] High contrast mode works correctly

### Functional Testing
- [ ] Forms can be completed with keyboard only
- [ ] Modals can be opened and closed with keyboard
- [ ] Drag and drop has keyboard alternative
- [ ] All features work without mouse

### Automated Testing
- [ ] Run axe DevTools
- [ ] Run WAVE browser extension
- [ ] Run Lighthouse accessibility audit
- [ ] Fix all critical and serious issues

## Common Patterns

### Adding a New Interactive Element

```tsx
<button
  onClick={handleClick}
  className="..."
  aria-label="Descriptive action and target"
  aria-describedby="optional-description-id"
>
  <Icon className="h-4 w-4" aria-hidden="true" />
  <span>Button Text</span>
</button>
```

### Creating an Accessible Form Field

```tsx
<div className="space-y-2">
  <Label htmlFor="field-id">
    Field Label <span className="text-destructive" aria-label="required">*</span>
  </Label>
  <Input
    id="field-id"
    {...register('fieldName')}
    aria-describedby="field-hint"
    aria-required="true"
    aria-invalid={!!errors.fieldName}
  />
  {errors.fieldName && (
    <p className="text-sm text-destructive" role="alert" aria-live="assertive">
      {errors.fieldName.message}
    </p>
  )}
  <p id="field-hint" className="text-xs text-muted-foreground">
    Helper text for the field
  </p>
</div>
```

### Announcing Status Changes

```tsx
import { announceToScreenReader } from '@/lib/accessibility';

// In your component
const handleSave = async () => {
  try {
    await saveData();
    announceToScreenReader('Changes saved successfully', 'polite');
  } catch (error) {
    announceToScreenReader('Failed to save changes', 'assertive');
  }
};
```

## Resources

### WCAG Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM WCAG Checklist](https://webaim.org/standards/wcag/checklist)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [NVDA Screen Reader](https://www.nvaccess.org/)

### Best Practices
- [Inclusive Components](https://inclusive-components.design/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Maintenance

### Regular Audits
- Run automated accessibility tests before each release
- Conduct manual keyboard navigation testing
- Test with screen readers quarterly
- Review and update ARIA labels as features change

### Continuous Improvement
- Monitor user feedback for accessibility issues
- Stay updated with WCAG guidelines
- Participate in accessibility training
- Contribute to accessibility documentation

## Contact

For accessibility questions or to report issues, please contact the development team or file an issue in the project repository.
