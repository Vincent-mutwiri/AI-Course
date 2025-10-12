import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { uploadAPI } from "@/services/api";

interface FileUploadProps {
  type: "image" | "video" | "document";
  onUploadComplete: (fileUrl: string) => void;
  currentFile?: string;
}

export default function FileUpload({ type, onUploadComplete, currentFile }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentFile || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      if (type === "image" && file.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(file));
      }

      let response;
      if (type === "image") {
        response = await uploadAPI.uploadImage(file);
      } else if (type === "video") {
        response = await uploadAPI.uploadVideo(file);
      } else {
        response = await uploadAPI.uploadDocument(file);
      }

      onUploadComplete(response.fileUrl);
      setPreview(response.fileUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={
          type === "image"
            ? "image/*"
            : type === "video"
            ? "video/*"
            : ".pdf,.doc,.docx"
        }
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview && type === "image" && (
        <div className="relative inline-block">
          <img src={preview} alt="Preview" className="max-w-xs rounded-lg" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {preview && type !== "image" && (
        <div className="flex items-center gap-2 p-3 border rounded-lg">
          <span className="text-sm flex-1 truncate">{preview}</span>
          <Button variant="ghost" size="icon" onClick={handleRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? "Uploading..." : `Upload ${type}`}
      </Button>
    </div>
  );
}
