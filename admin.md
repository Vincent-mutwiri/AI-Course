Product Requirement Document (PRD): Edulimika Admin Course Builder V2
1. Project Overview
Goal: Build a comprehensive block-based course builder that enables admins to create rich, interactive learning experiences using drag-and-drop functionality.

Current State: You have 16 interactive element types but they're embedded in JSON. The new builder will provide a visual interface to compose courses.

Platform: Extends existing MERN stack (React 19, TypeScript, Vite, Express, MongoDB)

2. Core Feature: Block-Based Course Builder
Architecture
Three-Panel Layout:

┌─────────────┬──────────────────────┬─────────────┐
│   Course    │                      │   Block     │
│  Structure  │      Canvas          │  Library    │
│  (Sidebar)  │   (WYSIWYG Editor)   │  (Sidebar)  │
└─────────────┴──────────────────────┴─────────────┘

Copy

Insert at cursor
Tech Stack
Drag & Drop: @hello-pangea/dnd (already installed)

Forms: React Hook Form + Zod (already installed)

UI: shadcn/ui components (Dialog, Accordion, Tabs)

Rich Text: Add TipTap or Lexical editor

File Upload: Existing AWS S3 + Multer setup

3. Block Types (21 Total)
Basic Content Blocks (6)
Text Block - Rich text editor (headings, paragraphs, lists, formatting)

Video Block - Upload to S3 or embed URL (YouTube, Vimeo)

Image Block - Upload image + caption + alt text

Code Block - Syntax-highlighted code snippets

List Block - Bullet/numbered lists with checkboxes

Divider Block - Visual separator

Interactive Blocks (16 - Already in DB Schema)
Reflection - Open-ended text input with min length validation

Poll - Multiple choice with live results

Word Cloud - Collaborative word submissions

AI Generator - Content generation via Inflection API

Choice Comparison - Side-by-side design comparison

Design Fixer - Identify issues in bad designs

Player Type Simulator - Bartle's player types quiz

Reward Schedule Designer - Design reward systems

Flow Channel Evaluator - Challenge vs skill matrix

Pitch Analysis Generator - Game pitch feedback

Narrative Generator - Story creation tool

Dark Pattern Redesigner - Ethical design exercises

ROE Dashboard - Return on Engagement metrics

Journey Timeline - User journey mapping

Certificate Generator - Auto-generate completion certificates

Final Assessment - Comprehensive quiz with passing score

4. Database Schema Updates
Current Course Model (Keep as-is)
Course {
  modules: [{
    lessons: [{
      interactiveElements: [{ type, config, ... }]
    }]
  }]
}

Copy

Insert at cursor
typescript
New Block Model (Add to Lesson)
Lesson {
  blocks: [{
    id: string,           // UUID for drag-drop
    type: BlockType,      // "text" | "video" | "reflection" | etc.
    order: number,        // Display order
    content: {
      // Type-specific content
      text?: string,      // For text blocks
      url?: string,       // For video/image
      config?: object,    // For interactive elements
      meta?: object       // Captions, settings, etc.
    },
    createdAt: Date,
    updatedAt: Date
  }]
}

Copy

Insert at cursor
typescript
5. UI Components Breakdown
Left Sidebar: Course Structure
<CourseStructure>
  <Accordion> // shadcn/ui
    {modules.map(module => (
      <AccordionItem>
        <ModuleHeader />
        <LessonList>
          {lessons.map(lesson => (
            <LessonItem 
              active={currentLesson === lesson.id}
              onClick={() => loadLesson(lesson.id)}
            />
          ))}
        </LessonList>
      </AccordionItem>
    ))}
  </Accordion>
  <Button onClick={addModule}>+ Add Module</Button>
</CourseStructure>

Copy

Insert at cursor
typescript
Center: Canvas (WYSIWYG Editor)
<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="canvas">
    {blocks.map((block, index) => (
      <Draggable key={block.id} draggableId={block.id} index={index}>
        <BlockRenderer 
          block={block}
          onEdit={() => openBlockEditor(block)}
          onDelete={() => deleteBlock(block.id)}
        />
      </Draggable>
    ))}
  </Droppable>
</DragDropContext>

Copy

Insert at cursor
typescript
Right Sidebar: Block Library
<BlockLibrary>
  <Tabs> // shadcn/ui
    <TabsList>
      <TabsTrigger value="basic">Basic</TabsTrigger>
      <TabsTrigger value="interactive">Interactive</TabsTrigger>
    </TabsList>
    
    <TabsContent value="basic">
      {basicBlocks.map(block => (
        <BlockCard 
          icon={block.icon}
          title={block.title}
          onClick={() => addBlock(block.type)}
        />
      ))}
    </TabsContent>
    
    <TabsContent value="interactive">
      {interactiveBlocks.map(block => (
        <BlockCard 
          icon={block.icon}
          title={block.title}
          description={block.description}
          onClick={() => addBlock(block.type)}
        />
      ))}
    </TabsContent>
  </Tabs>
</BlockLibrary>


Copy

Insert at cursor
typescript
6. Block Configuration Modals
Each block type opens a configuration dialog:

<Dialog> // shadcn/ui
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Configure {blockType}</DialogTitle>
    </DialogHeader>
    
    <Form> // React Hook Form
      {/* Type-specific fields */}
      {blockType === 'video' && (
        <>
          <FormField name="uploadType" type="radio" />
          <FormField name="url" type="text" />
          <FormField name="file" type="file" />
        </>
      )}
      
      {blockType === 'reflection' && (
        <>
          <FormField name="prompt" type="textarea" />
          <FormField name="minLength" type="number" />
          <FormField name="placeholder" type="text" />
        </>
      )}
      
      {/* ... other block types */}
    </Form>
    
    <DialogFooter>
      <Button variant="outline" onClick={cancel}>Cancel</Button>
      <Button onClick={saveBlock}>Save Block</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


Copy

Insert at cursor
typescript
7. API Routes (New)
Course Builder Endpoints
// Get course for editing
GET /api/admin/courses/:id/edit

// Save lesson blocks
PUT /api/admin/courses/:courseId/modules/:moduleId/lessons/:lessonId/blocks
Body: { blocks: Block[] }

// Upload media
POST /api/admin/upload
Body: FormData (file)
Response: { url: string }

// Reorder blocks
PATCH /api/admin/courses/:courseId/lessons/:lessonId/blocks/reorder
Body: { blockIds: string[] }

// Duplicate block
POST /api/admin/courses/:courseId/lessons/:lessonId/blocks/:blockId/duplicate

Copy

Insert at cursor
typescript
8. Implementation Plan
Phase 1: Foundation (Week 1)
 Create admin route /admin/courses/:id/builder
 Build three-panel layout (responsive)
 Implement course structure sidebar (read-only)
 Setup drag-drop context with @hello-pangea/dnd
 Create basic block renderer components
Phase 2: Basic Blocks (Week 2)
 Text block with rich text editor (TipTap/Lexical)
 Video block (upload + embed)
 Image block (upload + caption)
 Code block (syntax highlighting)
 Block configuration modals
 Save/update API integration
Phase 3: Interactive Blocks (Week 3)
 Reflection block
 Poll block
 Word Cloud block
 AI Generator block
 Quiz/Assessment block
 Certificate Generator block
Phase 4: Advanced Interactive Blocks (Week 4)
 Choice Comparison
 Design Fixer
 Player Type Simulator
 Reward Schedule Designer
 Flow Channel Evaluator
 Remaining specialized blocks
Phase 5: Polish & UX (Week 5)
 Block search/filter in library
 Keyboard shortcuts (Cmd+Z undo, Cmd+D duplicate)
 Auto-save with debounce
 Preview mode (student view)
 Block templates/presets
 Bulk operations (delete, duplicate, move)
9. Key Features
Auto-Save
const debouncedSave = useMemo(
  () => debounce(async (blocks) => {
    await api.put(`/courses/${courseId}/lessons/${lessonId}/blocks`, { blocks });
    toast.success('Saved');
  }, 2000),
  [courseId, lessonId]
);

useEffect(() => {
  debouncedSave(blocks);
}, [blocks]);

Copy

Insert at cursor
typescript
Block Actions
Duplicate: Clone block with new ID

Delete: Remove with confirmation

Move: Drag to reorder

Edit: Open configuration modal

Preview: See student view

Validation
Required fields per block type

File size limits (videos < 100MB, images < 5MB)

URL format validation

Min/max length for text inputs

10. Student View Integration
No changes needed - Your existing ModuleContent.tsx already renders interactiveElements. Just map the new blocks array to the same rendering logic:

// In ModuleContent.tsx
{lesson.blocks?.map(block => (
  <BlockRenderer key={block.id} block={block} />
))}

Copy

Insert at cursor
typescript
11. File Structure
src/
├── pages/
│   └── admin/
│       └── CourseBuilderPage.tsx
├── components/
│   └── admin/
│       └── course-builder/
│           ├── CourseStructure.tsx
│           ├── Canvas.tsx
│           ├── BlockLibrary.tsx
│           ├── blocks/
│           │   ├── TextBlock.tsx
│           │   ├── VideoBlock.tsx
│           │   ├── ReflectionBlock.tsx
│           │   └── ... (21 total)
│           └── modals/
│               ├── TextBlockModal.tsx
│               ├── VideoBlockModal.tsx
│               └── ... (21 total)

Copy

Insert at cursor
12. Success Metrics
Admin can create a 5-lesson course in < 30 minutes

Zero data loss with auto-save

All 21 block types functional

Mobile-responsive builder (tablet+)

< 2s block save time

This PRD leverages your existing tech stack and database schema while adding the visual course builder interface. The interactive elements you already have will integrate seamlessly into the new block system.