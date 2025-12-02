import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function PageBuilder() {
    const navigate = useNavigate();
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    const handleCreatePage = () => {
        navigate("/admin/pages/new");
    };

    const handleEditPage = (pageId: string) => {
        navigate(`/admin/pages/${pageId}/edit`);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Page Management</h1>
                <Button onClick={handleCreatePage} className="gap-2">
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
                                        <Button variant="ghost" size="icon" onClick={() => handleEditPage(page._id)}>
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
        </div>
    );
}
