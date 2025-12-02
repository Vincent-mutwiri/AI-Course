import { useEffect, useState } from "react";
import api from "@/services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function PageBuilder() {
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [editingPage, setEditingPage] = useState<any>(null);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const response = await api.get("/admin/pages");
            setPages(response.data.pages);
        } catch (error) {
            console.error("Failed to fetch pages", error);
            toast.error("Failed to load pages");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Construct the content object expected by the backend
        const textContent = formData.get("content") as string;
        const content = {
            version: '1.0',
            blocks: [
                {
                    id: crypto.randomUUID(),
                    type: 'text',
                    order: 0,
                    content: {
                        text: textContent
                    }
                }
            ]
        };

        const data = {
            title: formData.get("title"),
            slug: formData.get("slug"),
            type: formData.get("type"),
            content: content,
            isPublished: formData.get("isPublished") === "on",
        };

        try {
            if (editingPage) {
                await api.put(`/admin/pages/${editingPage._id}`, data);
                toast.success("Page updated successfully");
            } else {
                await api.post("/admin/pages", data);
                toast.success("Page created successfully");
            }
            setShowDialog(false);
            setEditingPage(null);
            fetchPages();
        } catch (error) {
            console.error("Failed to save page", error);
            toast.error("Failed to save page");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this page?")) return;
        try {
            await api.delete(`/admin/pages/${id}`);
            toast.success("Page deleted successfully");
            fetchPages();
        } catch (error) {
            console.error("Failed to delete page", error);
            toast.error("Failed to delete page");
        }
    };

    const openEdit = (page: any) => {
        setEditingPage(page);
        setShowDialog(true);
    };

    const openNew = () => {
        setEditingPage(null);
        setShowDialog(true);
    };

    // Helper to extract text content from page object
    const getPageContent = (page: any) => {
        if (!page?.content) return "";
        // Handle legacy string content
        if (typeof page.content === 'string') return page.content;
        // Handle block structure
        if (page.content.blocks && Array.isArray(page.content.blocks)) {
            const textBlock = page.content.blocks.find((b: any) => b.type === 'text');
            return textBlock?.content?.text || "";
        }
        return "";
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Page Management</h1>
                <Button onClick={openNew} className="gap-2">
                    <Plus className="h-4 w-4" /> Create Page
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pages.map((page) => (
                            <TableRow key={page._id}>
                                <TableCell className="font-medium">{page.title}</TableCell>
                                <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
                                <TableCell className="capitalize">{page.type}</TableCell>
                                <TableCell>
                                    <Badge variant={page.isPublished ? "default" : "secondary"}>
                                        {page.isPublished ? "Published" : "Draft"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(page)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(page._id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingPage ? "Edit Page" : "Create New Page"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" defaultValue={editingPage?.title} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" name="slug" defaultValue={editingPage?.slug} required placeholder="e.g. about-us" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Page Type</Label>
                            <select
                                id="type"
                                name="type"
                                className="w-full border rounded-md p-2 bg-background"
                                defaultValue={editingPage?.type || "page"}
                            >
                                <option value="page">Standard Page</option>
                                <option value="blog">Blog Post</option>
                                <option value="home">Landing Page</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                name="content"
                                defaultValue={getPageContent(editingPage)}
                                required
                                className="min-h-[200px]"
                                placeholder="# Markdown or HTML content"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPublished"
                                name="isPublished"
                                defaultChecked={editingPage?.isPublished}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="isPublished">Publish immediately</Label>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                            <Button type="submit">Save Page</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
