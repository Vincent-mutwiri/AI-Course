# AISettings Component

## Overview

The `AISettings` component provides a user interface for configuring default AI content generation preferences. Settings are automatically saved to localStorage per user and loaded when the component mounts.

## Features

- **Default Tone Selection**: Choose between formal, conversational, or encouraging writing styles
- **Default Reading Level**: Set complexity level (high school, college, professional)
- **Default Content Length**: Control detail level (brief, moderate, detailed)
- **Auto-save**: Settings are automatically saved to localStorage on change
- **Reset to Defaults**: One-click reset to default settings
- **Per-user Storage**: Settings are stored per user ID in localStorage

## Usage

### Basic Usage

```tsx
import { AISettings } from '@/components/admin/AISettings';

function SettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <AISettings />
    </div>
  );
}
```

### With Change Callback

```tsx
import { AISettings, AISettings as AISettingsType } from '@/components/admin/AISettings';

function SettingsPage() {
  const handleSettingsChange = (settings: AISettingsType) => {
    console.log('Settings updated:', settings);
    // Perform additional actions when settings change
  };

  return (
    <div className="container mx-auto p-6">
      <AISettings onSettingsChange={handleSettingsChange} />
    </div>
  );
}
```

## API

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSettingsChange` | `(settings: AISettings) => void` | No | Callback function called when settings change |

### AISettings Interface

```typescript
interface AISettings {
  tone: 'formal' | 'conversational' | 'encouraging';
  readingLevel: 'high-school' | 'college' | 'professional';
  length: 'brief' | 'moderate' | 'detailed';
}
```

## Utility Functions

The component exports utility functions for programmatic access to settings:

### loadAISettings()

Load AI settings from localStorage for the current user.

```typescript
import { loadAISettings } from '@/components/admin/AISettings';

const settings = loadAISettings();
console.log(settings.tone); // 'conversational'
```

### saveAISettings(settings)

Save AI settings to localStorage for the current user.

```typescript
import { saveAISettings } from '@/components/admin/AISettings';

saveAISettings({
  tone: 'formal',
  readingLevel: 'professional',
  length: 'detailed'
});
```

## Integration with AIAssistantPanel

The `AIAssistantPanel` component automatically loads saved settings on mount:

```tsx
// AIAssistantPanel.tsx
import { loadAISettings } from '@/components/admin/AISettings';

const [generationOptions, setGenerationOptions] = useState<GenerationOptions>(() => {
  const savedSettings = loadAISettings();
  return {
    tone: savedSettings.tone,
    readingLevel: savedSettings.readingLevel,
    length: savedSettings.length
  };
});
```

Users can still override these defaults for individual generations within the AI Assistant panel.

## Storage

Settings are stored in localStorage with the following key format:

```
ai-settings-{userId}
```

Where `{userId}` is extracted from the auth data in localStorage, or defaults to `'default-user'` if not authenticated.

## Default Settings

```typescript
{
  tone: 'conversational',
  readingLevel: 'college',
  length: 'moderate'
}
```

## Setting Descriptions

### Tone Options

- **Formal**: Professional and academic language suitable for formal educational content
- **Conversational**: Friendly and approachable tone that feels like a conversation
- **Encouraging**: Motivational and supportive language that builds confidence

### Reading Level Options

- **High School**: Accessible language with simpler concepts and vocabulary
- **College**: Intermediate complexity with standard academic terminology
- **Professional**: Advanced concepts with technical and specialized language

### Content Length Options

- **Brief**: Concise and to-the-point content without extra elaboration
- **Moderate**: Balanced detail with appropriate explanation and examples
- **Detailed**: Comprehensive content with extensive examples and elaboration

## Example: Adding to Admin Dashboard

```tsx
import { AISettings } from '@/components/admin/AISettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function AdminDashboard() {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-settings">AI Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          {/* Dashboard content */}
        </TabsContent>
        
        <TabsContent value="ai-settings">
          <AISettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## Accessibility

The component follows WCAG 2.1 AA guidelines:

- Proper label associations with form controls
- Keyboard navigation support via Select components
- Clear visual feedback for interactive elements
- Descriptive text for each setting option

## Requirements Satisfied

This component satisfies the following requirements from the AI Content Assistant spec:

- **13.1**: Provides settings for tone (formal, conversational, encouraging)
- **13.2**: Provides settings for reading level (high school, college, professional)
- **13.3**: Provides settings for content length (brief, moderate, detailed)
- **13.4**: Saves admin preferences to localStorage for future generations
- **13.5**: Allows per-generation override of default settings (via AIAssistantPanel)
