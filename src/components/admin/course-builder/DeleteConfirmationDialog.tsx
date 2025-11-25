import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Block {
    id: string;
    type: string;
    order: number;
    content: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

interface DeleteConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    block: Block | null;
    blockCount?: number;
}

/**
 * Get a human-readable preview of block content
 */
function getBlockPreview(block: Block): string {
    const { type, content } = block;

    switch (type) {
        case "text":
            const textContent = content.text?.replace(/<[^>]*>/g, "").substring(0, 100) || "Empty text block";
            return textContent.length > 100 ? `${textContent}...` : textContent;

        case "video":
            return content.title || content.videoUrl || "Video block";

        case "image":
            return content.caption || content.altText || "Image block";

        case "code":
            return `${content.language || "javascript"} code snippet`;

        case "list":
            const itemCount = content.items?.length || 0;
            return `${content.listType || "bullet"} list with ${itemCount} item${itemCount !== 1 ? "s" : ""}`;

        case "divider":
            return "Horizontal divider";

        case "reflection":
            return content.question || content.title || "Reflection question";

        case "poll":
            return content.question || content.title || "Poll";

        case "wordCloud":
            return content.prompt || content.title || "Word cloud";

        case "aiGenerator":
            return content.title || "AI Generator";

        default:
            return content.title || content.question || `${type} block`;
    }
}

/**
 * Get a human-readable block type name
 */
function getBlockTypeName(type: string): string {
    const typeNames: Record<string, string> = {
        text: "Text",
        video: "Video",
        image: "Image",
        code: "Code",
        list: "List",
        divider: "Divider",
        reflection: "Reflection",
        poll: "Poll",
        wordCloud: "Word Cloud",
        aiGenerator: "AI Generator",
        choiceComparison: "Choice Comparison",
        certificateGenerator: "Certificate Generator",
        finalAssessment: "Final Assessment",
        aiJourney: "AI Journey",
        buildABot: "Build A Bot",
        conceptMap: "Concept Map",
        dataDashboard: "Data Dashboard",
        ethicalDilemmaSolver: "Ethical Dilemma Solver",
        gamificationConceptMap: "Gamification Concept Map",
        identifyPersonalization: "Identify Personalization",
        playerTypeAnalyzer: "Player Type Analyzer",
        presentationCoach: "Presentation Coach",
        sentenceBuilder: "Sentence Builder",
        visualTokens: "Visual Tokens",
    };

    return typeNames[type] || type;
}

export function DeleteConfirmationDialog({
    open,
    onClose,
    onConfirm,
    block,
    blockCount = 1,
}: DeleteConfirmationDialogProps) {
    const isBulkDelete = blockCount > 1;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-destructive/10">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <DialogTitle>
                            {isBulkDelete ? `Delete ${blockCount} Blocks?` : "Delete Block?"}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-left space-y-3">
                        {isBulkDelete ? (
                            <>
                                <p>
                                    You are about to delete <strong>{blockCount} blocks</strong>. This action cannot be undone.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    All selected blocks will be permanently removed from this lesson.
                                </p>
                            </>
                        ) : block ? (
                            <>
                                <p>
                                    You are about to delete this <strong>{getBlockTypeName(block.type)}</strong> block. This action cannot be undone.
                                </p>
                                <div className="bg-muted p-3 rounded-md border">
                                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                                        Block Preview
                                    </p>
                                    <p className="text-sm text-foreground line-clamp-3">
                                        {getBlockPreview(block)}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p>Are you sure you want to delete this block? This action cannot be undone.</p>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                    >
                        {isBulkDelete ? `Delete ${blockCount} Blocks` : "Delete Block"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
