# Commit Guide: Module 1 Restructure

## Commit Sequence

Follow these commits in order for a clean git history:

### Commit 1: Add BuildABot Component
```bash
git add src/components/interactive/BuildABot.tsx
git add src/components/interactive/InteractiveElementRouter.tsx
git commit -m "feat: add BuildABot component for AI personality customization"
```

**What**: BuildABot component with personality trait selection
**Why**: Allows students to create custom AI assistants with different personalities

---

### Commit 2: Create Module 1 Restructure Data
```bash
git add module1-restructured.json
git commit -m "feat: restructure Module 1 to focus on How AI Thinks"
```

**What**: New Module 1 JSON structure with 3 lessons
**Why**: Shifts from ethics-focused to hands-on AI fundamentals

---

### Commit 3: Add Documentation
```bash
git add MODULE_1_RESTRUCTURE_GUIDE.md
git add COMMIT_GUIDE.md
git commit -m "docs: add Module 1 restructure and commit guides"
```

**What**: Comprehensive documentation for the restructure
**Why**: Helps team understand changes and migration process

---

## Quick Commit (All at Once)

If you prefer to commit everything together:

```bash
git add src/components/interactive/BuildABot.tsx
git add src/components/interactive/InteractiveElementRouter.tsx
git add module1-restructured.json
git add MODULE_1_RESTRUCTURE_GUIDE.md
git add COMMIT_GUIDE.md
git commit -m "feat: restructure Module 1 with interactive AI fundamentals

- Add BuildABot component for personality customization
- Create new Module 1: How AI Thinks (3 lessons)
- Add comprehensive restructure documentation
- Update InteractiveElementRouter to support BuildABot

BREAKING CHANGE: Module 1 content completely replaced"
```

---

## Verify Before Committing

Run these checks:

```bash
# 1. Check TypeScript compilation
npm run build

# 2. Verify no linting errors
npm run lint

# 3. Check all files are staged
git status

# 4. Review changes
git diff --staged
```

---

## After Committing

### 1. Update MongoDB
Run the migration script or manually update Module 1 in your database.

### 2. Test Components
- Start backend: `cd server && npm run dev`
- Start frontend: `npm run dev`
- Navigate to Module 1 and test each lesson

### 3. Deploy
```bash
# Push to remote
git push origin main

# Deploy backend (if using Render)
# Automatic deployment should trigger

# Deploy frontend (if using Vercel)
# Automatic deployment should trigger
```

---

## Rollback Instructions

If something goes wrong:

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Restore specific file
git checkout HEAD~1 -- path/to/file
```

---

## Branch Strategy (Optional)

If you want to test before merging to main:

```bash
# Create feature branch
git checkout -b feature/module-1-restructure

# Make commits
git add ...
git commit -m "..."

# Push to remote
git push origin feature/module-1-restructure

# Create PR and merge after testing
```

---

## Summary of Changes

### Files Added (3)
- `src/components/interactive/BuildABot.tsx`
- `module1-restructured.json`
- `MODULE_1_RESTRUCTURE_GUIDE.md`

### Files Modified (1)
- `src/components/interactive/InteractiveElementRouter.tsx`

### Database Changes
- Module 1 structure completely replaced
- Old content moved to backup

---

## Next Steps After Commit

1. ✅ Commit code changes
2. ⏳ Update MongoDB with new Module 1
3. ⏳ Test all interactive components
4. ⏳ Deploy to production
5. ⏳ Monitor user engagement
6. ⏳ Gather feedback
