# Block Migration Guide

## Overview

This guide explains how to migrate existing courses from the legacy `interactiveElements` format to the new `blocks` format.

## What Changed

The course builder now uses a unified `blocks` array instead of separate `interactiveElements`. Each block has:
- A unique UUID (`id`)
- A type (basic content or interactive)
- An order number
- Content configuration
- Timestamps

## Running the Migration

To migrate all courses in your database:

```bash
cd server
pnpm run migrate:blocks
```

## What the Migration Does

1. **Finds all courses** with lessons containing `interactiveElements`
2. **Converts each interactive element** to a block with:
   - Generated UUID for the `id` field
   - Order based on original array index
   - All existing configuration preserved in `content`
   - Proper timestamps
3. **Skips lessons** that already have blocks (safe to run multiple times)
4. **Maintains backward compatibility** by keeping `interactiveElements` intact

## Migration Output

The script provides detailed logging:
- ✅ Success indicators for each migrated lesson
- ⏭️ Skip indicators for lessons without interactive elements
- 📊 Summary statistics at the end

Example output:
```
📚 Found 4 course(s) to process
📖 Processing course: "AI in EdTech"
  📂 Module: "Module 1: How AI Thinks"
    📝 Lesson: "Understanding Tokens" - Migrating 1 interactive element(s)
    ✅ Created 1 block(s)
...
============================================================
📊 Migration Summary:
============================================================
✅ Courses updated: 3
✅ Lessons updated: 34
✅ Blocks created: 35
============================================================
```

## Backward Compatibility

The migration maintains backward compatibility:
- Legacy `interactiveElements` are preserved
- Student view checks for `blocks` first, falls back to `interactiveElements`
- No data loss occurs during migration

## New Interactive Types Added

The migration also added support for three additional interactive element types that were in use but not in the schema:
- `visualTokens` - Visual token breakdown component
- `sentenceBuilder` - Sentence building interactive
- `simulation` - General simulation component

## Rollback

If you need to rollback:
1. The original `interactiveElements` are still in the database
2. Simply remove the `blocks` arrays from lessons
3. The system will fall back to using `interactiveElements`

## Verification

After migration, verify by:
1. Checking the migration summary output
2. Opening courses in the admin course builder
3. Viewing lessons in student view to ensure proper rendering

## Technical Details

### Block Structure

```typescript
interface IBlock {
  id: string;              // UUID v4
  type: BlockType;         // One of 24+ block types
  order: number;           // 0-indexed position
  content: {
    // Type-specific fields
    question?: string;
    prompt?: string;
    config?: any;
    meta?: Record<string, any>;
    // ... more fields
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Mapping Logic

The migration maps all interactive element fields to block content:
- Direct fields: `question`, `prompt`, `title`, `description`, `options`, `config`
- Metadata fields: `badSlideUrl`, `goodSlideUrl`, `generatorType`, `minLength`, etc.
- All configuration is preserved in `content.config` or `content.meta`

## Support

If you encounter issues during migration:
1. Check the error message for validation failures
2. Ensure all interactive element types are in the Course model enum
3. Verify MongoDB connection in `.env` file
4. Run with `NODE_ENV=development` for more detailed logs
