import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { adminAPI } from "@/services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BarChart, Users, CheckCircle, Edit, Settings, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CourseAnalytics() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [instructorImageUrl, setInstructorImageUrl] = useState("");

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get("/admin/courses/stats");
            setCourses(response.data.stats);
        } catch (error) {
            console.error("Failed to fetch course stats", error);
            toast.error("Failed to load course analytics");
        } finally {
            setLoading(false);
        }
    };

    const handleThumbnailUpload = async (file: File) => {
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post('/admin/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setThumbnailUrl(response.data.url);
            toast.success('Thumbnail uploaded successfully');
        } catch (error: any) {
            console.error('Failed to upload thumbnail:', error);
            toast.error('Failed to upload thumbnail');
        } finally {
            setUploading(false);
        }
    };

    const handleInstructorImageUpload = async (file: File) => {
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post('/admin/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setInstructorImageUrl(response.data.url);
            toast.success('Instructor image uploaded successfully');
        } catch (error: any) {
            console.error('Failed to upload instructor image:', error);
            toast.error('Failed to upload instructor image');
        } finally {
            setUploading(false);
        }
    };

    const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            await adminAPI.createCourse({
                title: formData.get("title"),
                description: formData.get("description"),
                instructor: formData.get("instructor"),
                instructorImage: instructorImageUrl,
                thumbnail: thumbnailUrl,
                category: formData.get("category"),
                level: formData.get("level"),
                isPublished: true,
                modules: [],
            });
            setShowCreateDialog(false);
            setThumbnailUrl("");
            setInstructorImageUrl("");
            toast.success('Course created successfully');
            fetchStats();
        } catch (error) {
            console.error("Failed to create course", error);
            toast.error('Failed to create course');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Course Analytics</h1>
                <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Create Course
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {courses.map((course) => (
                    <div key={course._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-lg line-clamp-1" title={course.title}>{course.title}</h3>
                                <p className="text-sm text-muted-foreground capitalize">{course.category}</p>
                            </div>
                            <Badge variant={course.isPublished ? "default" : "secondary"}>
                                {course.isPublished ? "Published" : "Draft"}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-blue-500" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Enrolled</p>
                                    <p className="font-bold">{course.enrolledCount}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Avg. Completion</p>
                                    <p className="font-bold">{course.avgCompletion}%</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-green-500 h-full transition-all duration-500"
                                style={{ width: `${course.avgCompletion}%` }}
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-2"
                                onClick={() => navigate(`/admin/courses/${course._id}/builder`)}
                            >
                                <Edit className="h-4 w-4" />
                                Builder
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="px-2"
                                onClick={() => toast.info("Edit details feature coming soon")}
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border rounded-lg bg-white dark:bg-gray-800">
                <div className="p-4 border-b">
                    <h3 className="font-semibold flex items-center gap-2">
                        <BarChart className="h-4 w-4" />
                        Detailed Breakdown
                    </h3>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Course Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Enrolled</TableHead>
                            <TableHead className="text-right">Completion Rate</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses.map((course) => (
                            <TableRow key={course._id}>
                                <TableCell className="font-medium">{course.title}</TableCell>
                                <TableCell className="capitalize">{course.category}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{course.isPublished ? "Published" : "Draft"}</Badge>
                                </TableCell>
                                <TableCell className="text-right">{course.enrolledCount}</TableCell>
                                <TableCell className="text-right">{course.avgCompletion}%</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => navigate(`/admin/courses/${course._id}/builder`)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Course</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateCourse} className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" required />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" required />
                        </div>
                        <div>
                            <Label htmlFor="instructor">Instructor</Label>
                            <Input id="instructor" name="instructor" required />
                        </div>
                        <div>
                            <Label>Instructor Profile Image</Label>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => e.target.files?.[0] && handleInstructorImageUpload(e.target.files[0])}
                                        disabled={uploading}
                                    />
                                    {instructorImageUrl && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setInstructorImageUrl("")}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                {instructorImageUrl && (
                                    <img src={instructorImageUrl} alt="Instructor" className="h-16 w-16 object-cover rounded-full" />
                                )}
                            </div>
                        </div>
                        <div>
                            <Label>Course Thumbnail</Label>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => e.target.files?.[0] && handleThumbnailUpload(e.target.files[0])}
                                        disabled={uploading}
                                    />
                                    {thumbnailUrl && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setThumbnailUrl("")}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                {thumbnailUrl && (
                                    <img src={thumbnailUrl} alt="Thumbnail" className="h-32 w-full object-cover rounded" />
                                )}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" name="category" required />
                        </div>
                        <div>
                            <Label htmlFor="level">Level</Label>
                            <select id="level" name="level" className="w-full border rounded p-2 bg-background" required>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                            <Button type="submit" disabled={uploading}>Create Course</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
