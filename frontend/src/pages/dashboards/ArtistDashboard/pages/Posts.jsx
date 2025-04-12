import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Send,
  Clock,
  Play,
} from "lucide-react";

const VideoModal = ({ video, isOpen, onClose }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[600px] p-0 bg-black">
      <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
        <video
          src={video}
          autoPlay
          controls
          className="w-full h-full object-contain"
          playsInline
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </DialogContent>
  </Dialog>
);

const CommentModal = ({ isOpen, onClose, post }) => {
  const [comment, setComment] = useState("");

  const comments = [
    { id: 1, user: "John Doe", text: "Amazing show!", time: "2h ago" },
    {
      id: 2,
      user: "Jane Smith",
      text: "Cant wait to see you perform again!",
      time: "5h ago",
    },
    {
      id: 3,
      user: "Mike Johnson",
      text: "You were hilarious! 😂",
      time: "1d ago",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{comment.user}</h4>
                  <span className="text-xs text-muted-foreground">
                    {comment.time}
                  </span>
                </div>
                <p className="text-sm mt-1">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => setComment("")}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PostCard = ({ post, onCommentClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const videoRef = useRef(null);
  const imageRef = useRef(null);

  const handleLike = () => {
    if (isLiked) {
      setLikesCount((prev) => prev - 1);
    } else {
      setLikesCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && post.type === "video") {
      videoRef.current.play().catch((error) => {
        console.log("Video play failed:", error);
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && post.type === "video") {
      videoRef.current.pause();
    }
  };

  const handleVideoError = (e) => {
    console.log("Video loading error:", e);
  };

  return (
    <Card className="overflow-hidden group relative h-[500px] flex flex-col">
      <motion.div
        className="relative flex-1"
        style={{ aspectRatio: "1/1" }}
        onHoverStart={handleMouseEnter}
        onHoverEnd={handleMouseLeave}
      >
        {post.type === "image" ? (
          <motion.div
            className="relative cursor-pointer h-full"
            whileHover={{ scale: 1.1, zIndex: 50 }}
          >
            <motion.img
              ref={imageRef}
              src={
                post.media ||
                "https://th.bing.com/th/id/OIP.XcAl8tHA4xa9hxqWSgddnQAAAA?rs=1&pid=ImgDetMain"
              }
              alt={post.caption}
              className="object-cover w-full h-full rounded-lg shadow-lg"
              animate={{
                scale: isHovered ? 1.15 : 1,
              }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowFullImage(true)}
            />
          </motion.div>
        ) : (
          <div className="relative w-full h-full bg-black/5">
            <video
              ref={videoRef}
              src={post.media}
              loop
              muted
              playsInline
              onError={handleVideoError}
              poster={
                post.thumbnail ||
                "https://th.bing.com/th/id/OIP.XcAl8tHA4xa9hxqWSgddnQAAAA?rs=1&pid=ImgDetMain"
              }
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
        )}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/60 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute bottom-0 p-4 w-full">
            <p className="text-white text-sm line-clamp-2">{post.caption}</p>
          </div>
        </div>
      </motion.div>

      {/* Video Modal */}
      {post.type === "video" && showVideo && (
        <VideoModal
          video={post.media}
          isOpen={showVideo}
          onClose={() => setShowVideo(false)}
        />
      )}

      {/* Image Modal */}
      {showFullImage && (
        <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
          <DialogContent className="max-w-[90vw] h-[90vh] p-0 overflow-hidden">
            <div className="relative w-full h-full">
              <img
                src={
                  post.media ||
                  "https://th.bing.com/th/id/OIP.XcAl8tHA4xa9hxqWSgddnQAAAA?rs=1&pid=ImgDetMain"
                }
                alt={post.caption}
                className="w-full h-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="p-4 bg-background">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <motion.button
              className="flex items-center gap-1 text-sm group"
              onClick={handleLike}
              whileTap={{ scale: 0.9 }}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isLiked
                    ? "fill-red-500 text-red-500"
                    : "group-hover:text-red-500"
                }`}
              />
              <span className={isLiked ? "text-red-500" : ""}>
                {likesCount}
              </span>
            </motion.button>
            <button
              className="flex items-center gap-1 text-sm"
              onClick={() => onCommentClick(post)}
            >
              <MessageCircle className="h-4 w-4" /> {post.comments}
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Share2 className="h-4 w-4 cursor-pointer" />
            <MoreHorizontal className="h-4 w-4 cursor-pointer" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <Clock className="h-3 w-3" /> {post.date}
        </p>
      </div>
    </Card>
  );
};

const Posts = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const posts = [
    {
      id: 1,
      type: "image",
      media:
        "https://th.bing.com/th/id/OIP.XcAl8tHA4xa9hxqWSgddnQAAAA?rs=1&pid=ImgDetMain",
      caption: "Sold out show at Comedy Club! Thank you NYC! 🎭",
      likes: 1234,
      comments: 89,
      date: "2h ago",
    },
    {
      id: 2,
      type: "video",
      media:
        "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Sample video URL
      thumbnail:
        "https://th.bing.com/th/id/OIP.XcAl8tHA4xa9hxqWSgddnQAAAA?rs=1&pid=ImgDetMain",
      caption: "Behind the scenes from tonight's performance 🎤",
      likes: 856,
      comments: 42,
      date: "5h ago",
    },
    {
      id: 3,
      type: "image",
      media:
        "https://th.bing.com/th/id/OIP.XcAl8tHA4xa9hxqWSgddnQAAAA?rs=1&pid=ImgDetMain",
      caption: "Just wrapped up the new special! Coming soon on Netflix 🍿",
      likes: 2541,
      comments: 167,
      date: "1d ago",
    },
    {
      id: 4,
      type: "image",
      media:
        "https://th.bing.com/th/id/OIP.XcAl8tHA4xa9hxqWSgddnQAAAA?rs=1&pid=ImgDetMain",
      caption: "Surprise appearance at The Comedy Store last night 🌟",
      likes: 1892,
      comments: 94,
      date: "2d ago",
    },
    {
      id: 5,
      type: "video",
      media:
        "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail:
        "https://th.bing.com/th/id/OIP.XcAl8tHA4xa9hxqWSgddnQAAAA?rs=1&pid=ImgDetMain",
      caption: "Rehearsal time! New material coming soon 🎭",
      likes: 723,
      comments: 38,
      date: "3h ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Posts</h3>
        <button className="text-primary hover:text-primary/80">
          Create Post
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onCommentClick={() => setSelectedPost(post)}
          />
        ))}
      </div>

      {selectedPost && (
        <CommentModal
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          post={selectedPost}
        />
      )}
    </div>
  );
};

export default Posts;
