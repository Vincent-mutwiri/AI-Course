import { useState, memo } from "react";
import {
    Edit2,
    Copy,
    Eye,
    Trash2,
    Type,
    Video,
    Image as ImageIcon,
    Code,
    List,
    Minus,
    MessageSquare,
    BarChart3,
    Cloud,
    Sparkles,
    GitCompare,
    Wrench,
    Users,
    Gift,
    TrendingUp,
    Mic,
    BookOpen,
    AlertTriangle,
    PieChart,
    Map,
    Award,
    CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBlockAriaLabel, getBlockActionAriaLabel } from "@/lib/accessibility";

interface Block {
    id: string;
    type: string;
    order: number;
    content: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

interface BlockRendererProps {
    block: Block;
    onEdit: () => void;
    onDuplicate: () => void;
    onPreview: () => void;
    onDelete: () => void;
    isDragging?: boolean;
    isSelected?: boolean;
}

// Map block types to their icons
const BLOCK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    text: Type,
    video: Video,
    image: ImageIcon,
    code: Code,
    list: List,
    divider: Minus,
    reflection: MessageSquare,
    poll: BarChart3,
    wordCloud: Cloud,
    aiGenerator: Sparkles,
    choiceComparison: GitCompare,
    designFixer: Wrench,
    playerTypeSimulator: Users,
    rewardScheduleDesigner: Gift,
    flowChannelEvaluator: TrendingUp,
    pitchAnalysisGenerator: Mic,
    narrativeGenerator: BookOpen,
    darkPatternRedesigner: AlertTriangle,
    roeDashboard: PieChart,
    journeyTimeline: Map,
    certificateGenerator: Award,
    finalAssessment: CheckCircle,
};

/**
 * Renders block content preview based on block type
 */
function renderBlockContent(block: Block): React.ReactNode {
    const { type, content } = block;

    switch (type) {
        case "text":
            return (
                <div className="prose prose-sm max-w-none">
                    <div
                        className="line-clamp-3 text-sm text-foreground"
                        dangerouslySetInnerHTML={{
                            __html: content.text?.substring(0, 200) || "Empty text block",
                        }}
                    />
                </div>
            );

        case "video":
            return (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            {content.videoSource === "upload" ? "Uploaded Video" : "Embedded Video"}
                        </span>
                    </div>
                    {content.title && (
                        <p className="text-sm font-medium line-clamp-1">{content.title}</p>
                    )}
                    {content.videoUrl && (
                        <p className="text-xs text-muted-foreground truncate">
                            {content.videoUrl}
                        </p>
                    )}
                </div>
            );

        case "image":
            return (
                <div className="space-y-2">
                    {content.imageUrl && (
                        <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden">
                            <img
                                src={content.imageUrl}
                                alt={content.altText || "Block image"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "";
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        </div>
                    )}
                    {content.caption && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            {content.caption}
                        </p>
                    )}
                </div>
            );

        case "code":
            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                            {content.language || "javascript"}
                        </span>
                    </div>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-hidden">
                        <code className="line-clamp-3">
                            {content.code?.substring(0, 150) || "// Empty code block"}
                        </code>
                    </pre>
                </div>
            );

        case "list":
            return (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <List className="h-3 w-3" />
                        <span className="capitalize">{content.listType || "bullet"} list</span>
                    </div>
                    <ul className="space-y-1 text-sm">
                        {content.items?.slice(0, 3).map((item: any, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                                {content.listType === "checkbox" && (
                                    <input
                                        type="checkbox"
                                        checked={item.checked || false}
                                        readOnly
                                        className="mt-1"
                                    />
                                )}
                                {content.listType === "numbered" && (
                                    <span className="text-muted-foreground">{idx + 1}.</span>
                                )}
                                {content.listType === "bullet" && (
                                    <span className="text-muted-foreground">•</span>
                                )}
                                <span className="line-clamp-1">{item.text}</span>
                            </li>
                        ))}
                        {content.items?.length > 3 && (
                            <li className="text-xs text-muted-foreground italic">
                                +{content.items.length - 3} more items
                            </li>
                        )}
                    </ul>
                </div>
            );

        case "divider":
            return (
                <div className="py-2">
                    <hr
                        className={cn(
                            "border-t",
                            content.style === "dashed" && "border-dashed",
                            content.style === "dotted" && "border-dotted"
                        )}
                    />
                    <p className="text-xs text-muted-foreground text-center mt-2">
                        Horizontal divider
                    </p>
                </div>
            );

        case "reflection":
            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        <span>Reflection Question</span>
                    </div>
                    {content.title && (
                        <p className="text-sm font-medium line-clamp-1">{content.title}</p>
                    )}
                    <p className="text-sm line-clamp-2">
                        {content.question || "No question provided"}
                    </p>
                    {content.minLength && (
                        <p className="text-xs text-muted-foreground">
                            Min. {content.minLength} characters
                        </p>
                    )}
                </div>
            );

        case "poll":
            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <BarChart3 className="h-3 w-3" />
                        <span>Poll</span>
                    </div>
                    {content.title && (
                        <p className="text-sm font-medium line-clamp-1">{content.title}</p>
                    )}
                    <p className="text-sm line-clamp-2">
                        {content.question || "No question provided"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {content.options?.length || 0} options
                    </p>
                </div>
            );

        case "wordCloud":
            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Cloud className="h-3 w-3" />
                        <span>Word Cloud</span>
                    </div>
                    {content.title && (
                        <p className="text-sm font-medium line-clamp-1">{content.title}</p>
                    )}
                    <p className="text-sm line-clamp-2">
                        {content.prompt || "No prompt provided"}
                    </p>
                </div>
            );

        case "aiGenerator":
            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkles className="h-3 w-3" />
                        <span>AI Generator</span>
                    </div>
                    <p className="text-sm font-medium line-clamp-1">
                        {content.title || "AI Generator"}
                    </p>
                    {content.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            {content.description}
                        </p>
                    )}
                    {content.generatorType && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded inline-block">
                            {content.generatorType}
                        </span>
                    )}
                </div>
            );

        // Interactive blocks with generic rendering
        case "choiceComparison":
        case "designFixer":
        case "playerTypeSimulator":
        case "rewardScheduleDesigner":
        case "flowChannelEvaluator":
        case "pitchAnalysisGenerator":
        case "narrativeGenerator":
        case "darkPatternRedesigner":
        case "roeDashboard":
        case "journeyTimeline":
        case "certificateGenerator":
        case "finalAssessment":
            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {(() => {
                            const Icon = BLOCK_ICONS[type];
                            return Icon ? <Icon className="h-3 w-3" /> : null;
                        })()}
                        <span className="capitalize">
                            {type.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                    </div>
                    <p className="text-sm font-medium line-clamp-1">
                        {content.title || content.question || "Interactive Element"}
                    </p>
                    {content.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            {content.description}
                        </p>
                    )}
                </div>
            );

        default:
            return (
                <div className="text-sm text-muted-foreground">
                    <p>Unknown block type: {type}</p>
                </div>
            );
    }
}

/**
 * BlockRenderer Component - Memoized for performance
 * Only re-renders when block data or callbacks change
 */
const BlockRenderer = memo(function BlockRenderer({
    block,
    onEdit,
    onDuplicate,
    onPreview,
    onDelete,
    isDragging = false,
    isSelected = false,
}: BlockRendererProps) {
    const [isHovered, setIsHovered] = useState(false);
    const Icon = BLOCK_ICONS[block.type] || Type;

    const blockAriaLabel = getBlockAriaLabel(block.type, block.order);

    return (
        <div
            className={cn(
                "relative bg-card border rounded-lg transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary",
                isDragging && "opacity-50",
                isHovered && "border-primary/50 shadow-sm",
                isSelected && "border-primary bg-primary/5"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="article"
            aria-label={blockAriaLabel}
            aria-selected={isSelected}
        >
            {/* Block Content */}
            <div className="p-4">
                {/* Block Header */}
                <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                        <div
                            className="p-1.5 rounded bg-primary/10 text-primary"
                            aria-hidden="true"
                        >
                            <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                {block.type}
                            </span>
                            <span className="text-xs text-muted-foreground/50" aria-label={`Position ${block.order + 1}`}>
                                #{block.order + 1}
                            </span>
                        </div>
                    </div>

                    {/* Action Toolbar - Shows on hover and focus */}
                    <div
                        className={cn(
                            "flex items-center gap-1 transition-opacity duration-200",
                            isHovered ? "opacity-100" : "opacity-0 focus-within:opacity-100"
                        )}
                        role="toolbar"
                        aria-label={`Actions for ${blockAriaLabel}`}
                    >
                        <button
                            onClick={onEdit}
                            className="p-2 hover:bg-accent rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            title="Edit block"
                            aria-label={getBlockActionAriaLabel('edit', block.type, block.order)}
                        >
                            <Edit2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                            onClick={onDuplicate}
                            className="p-2 hover:bg-accent rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            title="Duplicate block"
                            aria-label={getBlockActionAriaLabel('duplicate', block.type, block.order)}
                        >
                            <Copy className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                            onClick={onPreview}
                            className="p-2 hover:bg-accent rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            title="Preview block"
                            aria-label={getBlockActionAriaLabel('preview', block.type, block.order)}
                        >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                            title="Delete block"
                            aria-label={getBlockActionAriaLabel('delete', block.type, block.order)}
                        >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Block Preview Content */}
                <div className="mt-3">{renderBlockContent(block)}</div>
            </div>
        </div>
    );
});

export default BlockRenderer;
