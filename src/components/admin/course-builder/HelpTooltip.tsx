import { HelpCircle } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpTooltipProps {
    content: string;
    side?: "top" | "right" | "bottom" | "left";
    className?: string;
}

export function HelpTooltip({ content, side = "top", className = "" }: HelpTooltipProps) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        className={`inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full ${className}`}
                        aria-label="Help information"
                    >
                        <HelpCircle className="h-4 w-4" aria-hidden="true" />
                    </button>
                </TooltipTrigger>
                <TooltipContent side={side} className="max-w-xs">
                    <p className="text-sm">{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

// Predefined help content for common scenarios
export const HELP_CONTENT = {
    // General
    autoSave: "Changes are automatically saved every 2 seconds after you stop editing. Wait for the 'Saved' indicator before closing the page.",
    dragAndDrop: "Click and drag blocks to reorder them. The blue indicator shows where the block will be placed.",

    // Block actions
    editBlock: "Configure the block's content and settings. Required fields are marked with an asterisk (*).",
    duplicateBlock: "Create a copy of this block. The duplicate will appear immediately below the original. You can also use Cmd+D (Mac) or Ctrl+D (Windows/Linux).",
    deleteBlock: "Permanently remove this block. This action cannot be undone.",
    previewBlock: "See how this lesson will appear to students. Interactive elements are fully functional in preview mode.",

    // Block types - Basic
    textBlock: "Add formatted text content with headings, lists, and links. Use the rich text editor toolbar to format your content.",
    videoBlock: "Embed videos from YouTube or Vimeo, or upload your own video files (max 100MB). Always add a title for accessibility.",
    imageBlock: "Upload images (max 5MB) with captions. Alt text is required for screen reader accessibility.",
    codeBlock: "Display code with syntax highlighting. Select the programming language for proper formatting.",
    listBlock: "Create bullet lists, numbered lists, or checklists. Use numbered lists for sequential steps.",
    dividerBlock: "Add a visual separator between content sections. Use sparingly to avoid cluttering the page.",

    // Block types - Interactive
    reflectionBlock: "Prompt students to write reflective responses. Set a minimum length to encourage thoughtful answers.",
    pollBlock: "Gather student opinions with multiple choice questions. Results are displayed after voting.",
    wordCloudBlock: "Collect and visualize student responses as a word cloud. Best for single-word or short phrase responses.",
    aiGeneratorBlock: "Let students generate content using AI assistance. Provide clear instructions and set appropriate constraints.",
    choiceComparisonBlock: "Help students compare two options with pros/cons analysis. Great for decision-making exercises.",
    designFixerBlock: "Challenge students to identify and fix design problems. Useful for design thinking and UX courses.",
    playerTypeSimulatorBlock: "Explore different player types in gamification contexts. Students can experience scenarios from different perspectives.",
    rewardScheduleDesignerBlock: "Design and test different reward schedules. Visualize behavior patterns for each schedule type.",
    flowChannelEvaluatorBlock: "Assess activities for flow state potential. Students rate activities on challenge and skill dimensions.",
    certificateGeneratorBlock: "Generate completion certificates for students. Customize the template with your branding.",
    finalAssessmentBlock: "Create comprehensive assessments with multiple question types. Set passing scores and time limits.",

    // File uploads
    fileUpload: "Drag and drop files or click to browse. Supported formats and size limits are shown below the upload area.",
    imageUpload: "Upload JPG, PNG, GIF, or WebP images up to 5MB. Optimize images before upload for better performance.",
    videoUpload: "Upload MP4, WebM, or MOV videos up to 100MB. Consider using embed for existing YouTube/Vimeo videos to save storage.",

    // Validation
    requiredField: "This field is required. The form cannot be saved until all required fields are filled.",
    minLength: "Enter at least the minimum number of characters. This ensures students provide thoughtful responses.",
    maxLength: "Keep content within the maximum length. Shorter content is often more effective.",
    urlFormat: "Enter a valid URL starting with http:// or https://. Example: https://www.youtube.com/watch?v=...",

    // Course structure
    moduleAccordion: "Click to expand or collapse modules. The active lesson is highlighted in blue.",
    lessonSelection: "Click a lesson to edit its content. You'll be prompted to save if you have unsaved changes.",
    addModule: "Create a new module in your course. Modules help organize lessons into logical sections.",

    // Preview
    previewMode: "Preview shows exactly how students will see the lesson. All interactive elements are functional.",
    exitPreview: "Return to editing mode. Your lesson context is preserved when entering and exiting preview.",

    // Performance
    blockCount: "Aim for 10-20 blocks per lesson for optimal performance and student engagement.",
    mediaOptimization: "Compress images and videos before upload to improve loading times for students.",

    // Accessibility
    altText: "Describe the image content for screen reader users. Be specific and concise. Example: 'Bar chart showing sales growth from 2020-2025'",
    headingStructure: "Use headings in order (H1, H2, H3) to create a logical document structure for screen readers.",
    colorContrast: "Ensure text has sufficient contrast with the background (4.5:1 minimum) for readability.",
    keyboardNavigation: "All interactive elements can be accessed using the keyboard. Press Tab to navigate, Enter to activate.",
};
