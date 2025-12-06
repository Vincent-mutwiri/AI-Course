import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings, RotateCcw } from 'lucide-react';

/**
 * AI Settings interface
 */
export interface AISettings {
    tone: 'formal' | 'conversational' | 'encouraging';
    readingLevel: 'high-school' | 'college' | 'professional';
    length: 'brief' | 'moderate' | 'detailed';
}

/**
 * Default AI settings
 */
const DEFAULT_SETTINGS: AISettings = {
    tone: 'conversational',
    readingLevel: 'college',
    length: 'moderate'
};

/**
 * Local storage key for AI settings
 */
const STORAGE_KEY = 'ai-settings';

/**
 * Get user ID from localStorage or generate a temporary one
 */
const getUserId = (): string => {
    const authData = localStorage.getItem('auth');
    if (authData) {
        try {
            const parsed = JSON.parse(authData);
            return parsed.userId || 'default-user';
        } catch {
            return 'default-user';
        }
    }
    return 'default-user';
};

/**
 * Load AI settings from localStorage
 */
export const loadAISettings = (): AISettings => {
    try {
        const userId = getUserId();
        const storageKey = `${STORAGE_KEY}-${userId}`;
        const stored = localStorage.getItem(storageKey);

        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                tone: parsed.tone || DEFAULT_SETTINGS.tone,
                readingLevel: parsed.readingLevel || DEFAULT_SETTINGS.readingLevel,
                length: parsed.length || DEFAULT_SETTINGS.length
            };
        }
    } catch (error) {
        console.error('Failed to load AI settings:', error);
    }

    return DEFAULT_SETTINGS;
};

/**
 * Save AI settings to localStorage
 */
export const saveAISettings = (settings: AISettings): void => {
    try {
        const userId = getUserId();
        const storageKey = `${STORAGE_KEY}-${userId}`;
        localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch (error) {
        console.error('Failed to save AI settings:', error);
    }
};

/**
 * AISettings Component Props
 */
export interface AISettingsProps {
    onSettingsChange?: (settings: AISettings) => void;
}

/**
 * AISettings Component
 * 
 * Provides a settings panel for configuring default AI content generation preferences.
 * Settings are saved to localStorage per user and loaded on component mount.
 * 
 * Features:
 * - Default tone selection (formal, conversational, encouraging)
 * - Default reading level selection (high school, college, professional)
 * - Default content length selection (brief, moderate, detailed)
 * - Reset to defaults functionality
 * - Automatic save to localStorage
 */
export const AISettings: React.FC<AISettingsProps> = ({ onSettingsChange }) => {
    const [settings, setSettings] = useState<AISettings>(DEFAULT_SETTINGS);
    const [hasChanges, setHasChanges] = useState(false);

    /**
     * Load settings from localStorage on component mount
     */
    useEffect(() => {
        const loadedSettings = loadAISettings();
        setSettings(loadedSettings);
    }, []);

    /**
     * Handle setting change
     */
    const handleSettingChange = <K extends keyof AISettings>(
        key: K,
        value: AISettings[K]
    ) => {
        const newSettings = {
            ...settings,
            [key]: value
        };

        setSettings(newSettings);
        setHasChanges(true);

        // Auto-save to localStorage
        saveAISettings(newSettings);

        // Notify parent component if callback provided
        if (onSettingsChange) {
            onSettingsChange(newSettings);
        }
    };

    /**
     * Reset settings to defaults
     */
    const handleReset = () => {
        setSettings(DEFAULT_SETTINGS);
        setHasChanges(false);

        // Save defaults to localStorage
        saveAISettings(DEFAULT_SETTINGS);

        // Notify parent component if callback provided
        if (onSettingsChange) {
            onSettingsChange(DEFAULT_SETTINGS);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <CardTitle>AI Content Settings</CardTitle>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        disabled={!hasChanges}
                        className="gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset to Defaults
                    </Button>
                </div>
                <CardDescription>
                    Configure default preferences for AI-generated content. These settings will be applied
                    to all new content generations unless overridden.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Tone Setting */}
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label htmlFor="tone-select" className="text-base font-semibold">
                            Default Tone
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Choose the writing style for generated content
                        </p>
                    </div>
                    <Select
                        value={settings.tone}
                        onValueChange={(value) => handleSettingChange('tone', value as AISettings['tone'])}
                    >
                        <SelectTrigger id="tone-select" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="formal">
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">Formal</span>
                                    <span className="text-xs text-muted-foreground">
                                        Professional and academic language
                                    </span>
                                </div>
                            </SelectItem>
                            <SelectItem value="conversational">
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">Conversational</span>
                                    <span className="text-xs text-muted-foreground">
                                        Friendly and approachable tone
                                    </span>
                                </div>
                            </SelectItem>
                            <SelectItem value="encouraging">
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">Encouraging</span>
                                    <span className="text-xs text-muted-foreground">
                                        Motivational and supportive language
                                    </span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Reading Level Setting */}
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label htmlFor="reading-level-select" className="text-base font-semibold">
                            Default Reading Level
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Set the complexity and vocabulary level for content
                        </p>
                    </div>
                    <Select
                        value={settings.readingLevel}
                        onValueChange={(value) => handleSettingChange('readingLevel', value as AISettings['readingLevel'])}
                    >
                        <SelectTrigger id="reading-level-select" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="high-school">
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">High School</span>
                                    <span className="text-xs text-muted-foreground">
                                        Accessible language, simpler concepts
                                    </span>
                                </div>
                            </SelectItem>
                            <SelectItem value="college">
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">College</span>
                                    <span className="text-xs text-muted-foreground">
                                        Intermediate complexity and terminology
                                    </span>
                                </div>
                            </SelectItem>
                            <SelectItem value="professional">
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">Professional</span>
                                    <span className="text-xs text-muted-foreground">
                                        Advanced concepts and technical language
                                    </span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Content Length Setting */}
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label htmlFor="length-select" className="text-base font-semibold">
                            Default Content Length
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Control how much detail is included in generated content
                        </p>
                    </div>
                    <Select
                        value={settings.length}
                        onValueChange={(value) => handleSettingChange('length', value as AISettings['length'])}
                    >
                        <SelectTrigger id="length-select" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="brief">
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">Brief</span>
                                    <span className="text-xs text-muted-foreground">
                                        Concise and to-the-point content
                                    </span>
                                </div>
                            </SelectItem>
                            <SelectItem value="moderate">
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">Moderate</span>
                                    <span className="text-xs text-muted-foreground">
                                        Balanced detail and explanation
                                    </span>
                                </div>
                            </SelectItem>
                            <SelectItem value="detailed">
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">Detailed</span>
                                    <span className="text-xs text-muted-foreground">
                                        Comprehensive with examples and elaboration
                                    </span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Settings Info */}
                <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                        Settings are automatically saved and will be applied to all future AI content generations.
                        You can override these settings for individual generations in the AI Assistant panel.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default AISettings;
