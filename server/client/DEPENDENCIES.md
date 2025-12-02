# Required Dependencies for Admin Page Builder

## Task 4: Block Palette and Canvas Components

The block palette and canvas components require the @dnd-kit library for drag-and-drop functionality.

### Installation

Run one of the following commands in your project root (or client directory if separate):

**Using npm:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Using yarn:**
```bash
yarn add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Using pnpm:**
```bash
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Package Details

- **@dnd-kit/core** (^6.0.0): Core drag-and-drop functionality
- **@dnd-kit/sortable** (^7.0.0): Sortable list behavior
- **@dnd-kit/utilities** (^3.0.0): Utility functions for transforms

### Why @dnd-kit?

We chose @dnd-kit over alternatives like react-beautiful-dnd because:

1. **Modern & Maintained**: Actively developed with regular updates
2. **TypeScript Support**: First-class TypeScript support
3. **Performance**: Uses CSS transforms for smooth animations
4. **Accessibility**: Built-in keyboard navigation and screen reader support
5. **Flexibility**: Highly customizable and extensible
6. **Bundle Size**: Smaller footprint than alternatives

### Verification

After installation, verify the packages are installed:

```bash
npm list @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

You should see output similar to:
```
your-project@1.0.0
├── @dnd-kit/core@6.x.x
├── @dnd-kit/sortable@7.x.x
└── @dnd-kit/utilities@3.x.x
```

### Usage in Components

The following components use @dnd-kit:

- `BlockCanvas.tsx`: Main drag-and-drop context and sortable container
- `SortableBlockItem.tsx`: Individual sortable block items

### Troubleshooting

**Issue: Module not found errors**
- Ensure you ran the install command in the correct directory
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

**Issue: TypeScript errors**
- Ensure you have TypeScript 4.x or later installed
- The @dnd-kit packages include their own type definitions

**Issue: Drag-and-drop not working**
- Check browser console for errors
- Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Verify the CSS is properly imported

### Browser Compatibility

@dnd-kit supports:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

### Additional Resources

- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [@dnd-kit GitHub](https://github.com/clauderic/dnd-kit)
- [Examples and Demos](https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/)

## Future Dependencies

Additional dependencies may be required for upcoming tasks:

- **Task 5-6**: Rich text editor (TinyMCE, Quill, or similar)
- **Task 7**: File upload utilities (may reuse existing)
- **Task 9**: Preview mode components (may reuse existing)

These will be documented as they are implemented.
