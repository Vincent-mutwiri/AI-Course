import { useState, useMemo } from "react";
import {
    Type,
    Video,
    Image,
    Code,
    List,
    Minus,
    MessageSquare,
    BarChart3,
    Cloud,
    Sparkles,
    GitCompare,
    Award,
    CheckCircle,
    Search,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BlockMetadata {
    type: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    category: "basic" | "interactive";
}

interface BlockLibraryProps {
    onBlockAdd: (blockType: string) => void;
}

// Define metadata for all 21 block types
const BLOCK_METADATA: BlockMetadata[] = [
    // Basic Blocks (6)
    {
        type: "text",
        icon: Type,
        title: "Text",
        description: "Rich text content with formatting, headings, and lists",
        category: "basic",
    },
    {
        type: "video",
        icon: Video,
        title: "Video",
        description: "Embed or upload videos from YouTube, Vimeo, or S3",
        category: "basic",
    },
    {
        type: "image",
        icon: Image,
        title: "Image",
        description: "Upload images with captions and alt text",
        category: "basic",
    },
    {
        type: "code",
        icon: Code,
        title: "Code",
        description: "Code snippets with syntax highlighting",
        category: "basic",
    },
    {
        type: "list",
        icon: List,
        title: "List",
        description: "Bullet points, numbered lists, or checkboxes",
        category: "basic",
    },
    {
        type: "divider",
        icon: Minus,
        title: "Divider",
        description: "Visual separator between content sections",
        category: "basic",
    },
    // Interactive Blocks (15)
    {
        type: "reflection",
        icon: MessageSquare,
        title: "Reflection",
        description: "Prompt students to reflect and write responses",
        category: "interactive",
    },
    {
        type: "poll",
        icon: BarChart3,
        title: "Poll",
        description: "Collect student opinions with multiple choice questions",
        category: "interactive",
    },
    {
        type: "wordCloud",
        icon: Cloud,
        title: "Word Cloud",
        description: "Generate collaborative word clouds from student input",
        category: "interactive",
    },
    {
        type: "aiGenerator",
        icon: Sparkles,
        title: "AI Generator",
        description: "AI-powered content generation tools",
        category: "interactive",
    },
    {
        type: "choiceComparison",
        icon: GitCompare,
        title: "Choice Comparison",
        description: "Compare and analyze different choices or options",
        category: "interactive",
    },
    {
        type: "certificateGenerator",
        icon: Award,
        title: "Certificate Generator",
        description: "Generate completion certificates",
        category: "interactive",
    },
    {
        type: "finalAssessment",
        icon: CheckCircle,
        title: "Final Assessment",
        description: "Comprehensive final assessment quiz",
        category: "interactive",
    },
];

interface BlockCardProps {
    metadata: BlockMetadata;
    onAdd: () => void;
    isHighlighted?: boolean;
}

function BlockCard({ metadata, onAdd, isHighlighted = false }: BlockCardProps) {
    const Icon = metadata.icon;

    return (
        <Card
            className={cn(
                "p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/50 hover:scale-[1.02]",
                "active:scale-[0.98] focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
                isHighlighted && "ring-2 ring-primary/30"
            )}
            onClick={onAdd}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onAdd();
                }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Add ${metadata.title} block. ${metadata.description}`}
        >
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0" aria-hidden="true">
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1">{metadata.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {metadata.description}
                    </p>
                </div>
            </div>
        </Card>
    );
}

export default function BlockLibrary({ onBlockAdd }: BlockLibraryProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"basic" | "interactive">("basic");

    // Filter blocks based on search query
    const filteredBlocks = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return BLOCK_METADATA;

        return BLOCK_METADATA.filter(
            (block) =>
                block.title.toLowerCase().includes(query) ||
                block.description.toLowerCase().includes(query) ||
                block.type.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    // Separate blocks by category
    const basicBlocks = filteredBlocks.filter((block) => block.category === "basic");
    const interactiveBlocks = filteredBlocks.filter(
        (block) => block.category === "interactive"
    );

    const handleBlockAdd = (blockType: string) => {
        onBlockAdd(blockType);
    };

    return (
        <div className="flex flex-col h-full" role="complementary" aria-label="Block library">
            {/* Header */}
            <div className="p-4 border-b">
                <h2 className="font-semibold text-sm mb-3" id="block-library-heading">Block Library</h2>

                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                        type="search"
                        placeholder="Search blocks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9"
                        aria-label="Search for block types"
                        aria-describedby="block-library-heading"
                    />
                </div>
            </div>

            {/* Tabs and Block Grid */}
            <div className="flex-1 overflow-y-auto p-4">
                <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as "basic" | "interactive")}
                    className="w-full"
                >
                    <TabsList className="w-full grid grid-cols-2 mb-4">
                        <TabsTrigger value="basic">
                            Basic
                            {searchQuery === "" && (
                                <span className="ml-1.5 text-xs opacity-60">
                                    ({basicBlocks.length})
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="interactive">
                            Interactive
                            {searchQuery === "" && (
                                <span className="ml-1.5 text-xs opacity-60">
                                    ({interactiveBlocks.length})
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="mt-0" role="tabpanel" aria-label="Basic blocks">
                        {basicBlocks.length > 0 ? (
                            <div className="space-y-2" role="list" aria-label={`${basicBlocks.length} basic blocks available`}>
                                {basicBlocks.map((block) => (
                                    <div key={block.type} role="listitem">
                                        <BlockCard
                                            metadata={block}
                                            onAdd={() => handleBlockAdd(block.type)}
                                            isHighlighted={
                                                searchQuery !== "" &&
                                                block.title
                                                    .toLowerCase()
                                                    .includes(searchQuery.toLowerCase())
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center" role="status" aria-live="polite">
                                <div className="text-muted-foreground/50 mb-2" aria-hidden="true">
                                    <Search className="h-8 w-8 mx-auto" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    No basic blocks found
                                </p>
                                <p className="text-xs text-muted-foreground/75 mt-1">
                                    Try a different search term
                                </p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="interactive" className="mt-0" role="tabpanel" aria-label="Interactive blocks">
                        {interactiveBlocks.length > 0 ? (
                            <div className="space-y-2" role="list" aria-label={`${interactiveBlocks.length} interactive blocks available`}>
                                {interactiveBlocks.map((block) => (
                                    <div key={block.type} role="listitem">
                                        <BlockCard
                                            metadata={block}
                                            onAdd={() => handleBlockAdd(block.type)}
                                            isHighlighted={
                                                searchQuery !== "" &&
                                                block.title
                                                    .toLowerCase()
                                                    .includes(searchQuery.toLowerCase())
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center" role="status" aria-live="polite">
                                <div className="text-muted-foreground/50 mb-2" aria-hidden="true">
                                    <Search className="h-8 w-8 mx-auto" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    No interactive blocks found
                                </p>
                                <p className="text-xs text-muted-foreground/75 mt-1">
                                    Try a different search term
                                </p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Footer Info */}
            <div className="p-4 border-t bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">
                    Click a block to add it to the canvas
                </p>
            </div>
        </div>
    );
}
