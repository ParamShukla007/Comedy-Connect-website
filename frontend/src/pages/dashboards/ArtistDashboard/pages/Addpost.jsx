import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Upload,
  X,
  Play,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AWSHelper from '@/utils/awsHelper';
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const PreviewCard = ({ mediaType, mediaPreview, caption }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && mediaType === "video") {
      videoRef.current
        .play()
        .catch((error) => console.log("Video play failed:", error));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && mediaType === "video") {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Card className="overflow-hidden group relative h-[500px] flex flex-col">
      {/* Media Container */}
      <div className="relative flex-1">
        <motion.div
          className="relative h-full"
          style={{ aspectRatio: "1/1" }}
          onHoverStart={handleMouseEnter}
          onHoverEnd={handleMouseLeave}
        >
          {mediaPreview ? (
            mediaType === "image" ? (
              <motion.img
                src={mediaPreview}
                alt="Preview"
                className="object-cover w-full h-full rounded-lg shadow-lg"
                animate={{ scale: isHovered ? 1.15 : 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => setShowFullImage(true)}
              />
            ) : (
              <div className="relative w-full h-full bg-black/5">
                <video
                  ref={videoRef}
                  src={mediaPreview}
                  loop
                  muted
                  playsInline
                  className="object-cover w-full h-full cursor-pointer"
                  onClick={() => setShowVideo(true)}
                />
                {!isHovered && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="w-full h-full bg-muted/20 flex items-center justify-center">
              <p className="text-muted-foreground">No media selected</p>
            </div>
          )}

          {/* Gradient Overlay - Always visible with caption */}
          <div
            className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/60 transition-opacity duration-300`}
          >
            <div className="absolute bottom-0 p-4 w-full">
              <p className="text-white text-sm line-clamp-2">
                {caption || "Add a caption..."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Full Image/Video Modal */}
      {showFullImage && mediaType === "image" && (
        <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
          <DialogContent className="max-w-[90vw] h-[90vh] p-0 overflow-hidden">
            <div className="relative w-full h-full">
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showVideo && mediaType === "video" && (
        <Dialog open={showVideo} onOpenChange={setShowVideo}>
          <DialogContent className="sm:max-w-[600px] p-0 bg-black">
            <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
              <video
                src={mediaPreview}
                autoPlay
                controls
                className="w-full h-full object-contain"
                playsInline
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Card Footer */}
      <div className="p-4 bg-background mt-auto">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <button className="flex items-center gap-1 text-sm group">
              <Heart className="h-4 w-4 group-hover:text-red-500" />
              <span>0</span>
            </button>
            <button className="flex items-center gap-1 text-sm">
              <MessageCircle className="h-4 w-4" /> 0
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Share2 className="h-4 w-4 cursor-pointer" />
            <MoreHorizontal className="h-4 w-4 cursor-pointer" />
          </div>
        </div>

        {/* Caption in footer */}
        <p className="text-sm mt-2 line-clamp-2">
          {caption || "Your caption will appear here"}
        </p>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <Clock className="h-3 w-3" /> Just now
        </p>
      </div>
    </Card>
  );
};

const AddPost = () => {
  const [mediaType, setMediaType] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileSelect = (e, type) => {
    e.preventDefault();
    e.stopPropagation();

    if (fileInputRef.current) {
      fileInputRef.current.accept = type === "image" ? "image/*" : "video/*";
      fileInputRef.current.value = ""; // Clear previous value
      fileInputRef.current.click();
    }
  };

  const validateFile = (file) => {
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      return false;
    }

    // Check file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setError("Please upload an image or video file");
      return false;
    }

    // Clear any previous errors
    setError("");
    return true;
  };

  const processFile = (file) => {
    try {
      if (!validateFile(file)) return;

      const objectUrl = URL.createObjectURL(file);
      const isVideo = file.type.startsWith("video/");

      // Update state at once to prevent re-renders
      setFile(file);
      setMediaType(isVideo ? "video" : "image");
      setMediaPreview(objectUrl);
      setError("");
    } catch (err) {
      console.error("Error processing file:", err);
      setError("Failed to process file. Please try again.");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [mediaPreview]);

  const clearMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setFile(null);
    setMediaType(null);
    setMediaPreview(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

 // Update the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    if (!file || !caption) {
      toast.error("Please select a file and add a caption");
      return;
    }

    // Upload to AWS
    const url = await AWSHelper.upload(file, 'artist-post');
    
    if (!url) {
      throw new Error('Failed to upload file');
    }

    // Create post
    const postData = {
      artistId: localStorage.getItem('userId'),
      caption: caption,
      mediaUrl: url,
      mediaType: mediaType
    };

    const response = await createPost(postData);

    if (!response.success) {
      throw new Error(response.message || 'Failed to create post');
    }

    toast.success("Post created successfully");
    navigate('/dashboard/posts');

  } catch (error) {
    toast.error(error.message || "Failed to create post");
  } finally {
    setIsLoading(false);
  }
};

// Update the handleMediaUpload function
const handleMediaUpload = async (e) => {
  const files = Array.from(e.target.files);
  const maxFiles = 15;
  
  if (media.length + files.length > maxFiles) {
    toast.error(`You can only upload up to ${maxFiles} files`);
    return;
  }

  for (const file of files) {
    try {
      const url = await AWSHelper.upload(file, formData.name || 'artist-post');
      if (!url) {
        throw new Error(`Failed to upload ${file.name}`);
      }
      
      setMedia(prev => [...prev, {
        file,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url
      }]);
    } catch (error) {
      toast.error(`Failed to upload ${file.name}`);
    }
  }
};

  const createPost = async (postData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/posts/createPost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to create post');
    }
  };


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg ${
                error
                  ? "border-red-500"
                  : mediaPreview
                  ? "border-primary"
                  : "border-muted-foreground/25"
              } relative`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) processFile(file);
              }}
              onClick={() => !mediaPreview && fileInputRef.current?.click()}
            >
              {!mediaPreview ? (
                <div className="h-[300px] flex flex-col items-center justify-center gap-4 p-4">
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => handleFileSelect(e, "image")}
                      className="px-6"
                    >
                      <ImageIcon className="mr-2 h-5 w-5" />
                      Upload Image
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => handleFileSelect(e, "video")}
                      className="px-6"
                    >
                      <VideoIcon className="mr-2 h-5 w-5" />
                      Upload Video
                    </Button>
                  </div>
                  <div className="text-center">
                    {error ? (
                      <p className="text-sm text-red-500">{error}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Drag and drop your media here, or click buttons above
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative h-[300px]">
                  {mediaType === "image" ? (
                    <img
                      src={mediaPreview}
                      alt="Upload preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <video
                      src={mediaPreview}
                      className="w-full h-full object-contain rounded-lg"
                      controls
                      playsInline
                    />
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearMedia();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                }}
              />
            </div>

            {/* Caption Input */}
            <div className="space-y-2">
              <Textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-[150px] text-base resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/dashboard/posts')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!mediaPreview || !caption || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4 animate-spin" />
                    Posting...
                  </span>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Live Preview Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Preview</h3>
          <PreviewCard
            mediaType={mediaType}
            mediaPreview={mediaPreview}
            caption={caption}
          />
        </div>
      </div>
    </div>
  );
};

export default AddPost;
