import { useState, useEffect, useRef } from "react";
import { mediaAPI } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
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

interface VideoPlayerProps {
  s3Key?: string;
  title: string;
  lessonId?: string;
  moduleId?: string;
  courseId?: string;
  onVideoUpdate?: (s3Key: string) => void;
  onVideoDelete?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  s3Key,
  title,
  lessonId,
  moduleId,
  courseId,
  onVideoUpdate,
  onVideoDelete,
}) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!s3Key);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!s3Key) {
      setIsLoading(false);
      return;
    }

    const fetchVideoUrl = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { url } = await mediaAPI.getPresignedUrl(s3Key);
        setVideoUrl(url);
      } catch (err) {
        console.error("Error fetching video URL:", err);
        setError("Failed to load video");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoUrl();
  }, [s3Key]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file");
      return;
    }

    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      setError("Video file must be less than 100MB");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const { s3Key: newS3Key } = await mediaAPI.uploadVideo(file, "videos");
      
      if (onVideoUpdate) {
        onVideoUpdate(newS3Key);
      }
      
      setUploadDialogOpen(false);
      
      // Refresh the video URL
      const { url } = await mediaAPI.getPresignedUrl(newS3Key);
      setVideoUrl(url);
    } catch (err) {
      console.error("Error uploading video:", err);
      setError("Failed to upload video");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    if (!s3Key) return;
    
    if (!confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      await mediaAPI.deleteMedia(s3Key);
      setVideoUrl(null);
      
      if (onVideoDelete) {
        onVideoDelete();
      }
    } catch (err) {
      console.error("Error deleting video:", err);
      setError("Failed to delete video");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-2">
        <Skeleton className="w-full h-64 rounded-lg" />
        <Skeleton className="w-48 h-4" />
      </div>
    );
  }

  if (!s3Key && !isAdmin) {
    return (
      <div className="w-full p-8 border-2 border-dashed rounded-lg text-center">
        <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">No video available for this lesson</p>
      </div>
    );
  }

  if (!s3Key && isAdmin) {
    return (
      <div className="w-full p-8 border-2 border-dashed rounded-lg text-center space-y-4">
        <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">No video uploaded yet</p>
        
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Video</DialogTitle>
              <DialogDescription>
                Upload a video file for this lesson (max 100MB)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="video-file">Video File</Label>
                <Input
                  id="video-file"
                  type="file"
                  accept="video/*"
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
    );
  }

  if (error && !videoUrl) {
    return (
      <div className="w-full p-8 border-2 border-destructive rounded-lg text-center">
        <p className="text-destructive">{error}</p>
        {isAdmin && s3Key && (
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative w-full rounded-lg overflow-hidden bg-black shadow-lg">
        <video
          ref={videoRef}
          className="w-full h-auto"
          aria-label={title}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls
        >
          {videoUrl && <source src={videoUrl} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>

        {/* Custom Controls Overlay (optional - native controls are enabled) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={handleMuteToggle}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <div className="flex-1" />
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={handleFullscreen}
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="flex gap-2">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Replace Video
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Replace Video</DialogTitle>
                <DialogDescription>
                  Upload a new video file for this lesson (max 100MB)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="video-file-replace">Video File</Label>
                  <Input
                    id="video-file-replace"
                    type="file"
                    accept="video/*"
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
            Delete Video
          </Button>
        </div>
      )}

      {error && videoUrl && (
        <p className="text-sm text-muted-foreground">{error}</p>
      )}
    </div>
  );
};
