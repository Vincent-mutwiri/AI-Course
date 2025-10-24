import { useState, useRef } from "react";
import { mediaAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploaderProps {
  currentUrl?: string;
  onImageUpdate?: (url: string) => void;
  onImageDelete?: () => void;
  label?: string;
  folder?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentUrl,
  onImageUpdate,
  onImageDelete,
  label = "Image",
  folder = "images",
}) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (10MB max for images)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image file must be less than 10MB");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const { url } = await mediaAPI.uploadImage(file, folder);
      
      if (onImageUpdate) {
        onImageUpdate(url);
      }
      
      setUploadDialogOpen(false);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    if (!currentUrl) return;
    
    if (!confirm(`Are you sure you want to delete this ${label.toLowerCase()}?`)) {
      return;
    }

    try {
      // Extract S3 key from URL if it's a full URL
      const s3Key = currentUrl.includes('s3.amazonaws.com') 
        ? currentUrl.split('.com/')[1] 
        : currentUrl;
      
      if (s3Key) {
        await mediaAPI.deleteMedia(s3Key);
      }
      
      if (onImageDelete) {
        onImageDelete();
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      setError("Failed to delete image");
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-2">
      {currentUrl ? (
        <div className="space-y-2">
          <div className="relative border rounded-lg overflow-hidden">
            <img
              src={currentUrl}
              alt={label}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="flex gap-2">
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Replace {label}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Replace {label}</DialogTitle>
                  <DialogDescription>
                    Upload a new image file (max 10MB)
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="image-file-replace">Image File</Label>
                    <Input
                      id="image-file-replace"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      disabled={uploading}
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                  {uploading && (
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {label}
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">No {label.toLowerCase()} uploaded yet</p>
          
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload {label}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload {label}</DialogTitle>
                <DialogDescription>
                  Upload an image file (max 10MB)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-file">Image File</Label>
                  <Input
                    id="image-file"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                {uploading && (
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};
