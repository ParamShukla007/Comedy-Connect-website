import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share2,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Send, Flag, Link } from "lucide-react";

const mockPosts = [
  {
    id: 1,
    artist: {
      id: 1,
      name: "Johnny D",
      image: "https://i.pravatar.cc/150?img=1",
      isVerified: true,
    },
    content: {
      type: "image",
      media: "https://source.unsplash.com/random/800x600/?comedy",
      caption: "Great show tonight! Thanks everyone for coming! 🎭",
      time: "2 hours ago",
      location: "Comedy Club NYC",
    },
    stats: {
      likes: 234,
      comments: 45,
      isLiked: false,
    },
  },
  // Add more mock posts...
];

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.stats.isLiked);
  const [likesCount, setLikesCount] = useState(post.stats.likes);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    // Add like animation here
    const likeAnimation = isLiked ? "unlike" : "like";
    // You can add more sophisticated animations
  };

  const handleComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now(),
      user: "Current User",
      text: comment,
      time: "Just now",
      likes: 0,
    };

    setComments((prev) => [newComment, ...prev]);
    setComment("");
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        {/* Artist Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={post.artist.image}
              alt={post.artist.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-1">
                <h4 className="font-semibold">{post.artist.name}</h4>
                {post.artist.isVerified && (
                  <Badge variant="secondary" className="px-1 py-0">
                    ✓
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {post.content.location}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Enhanced Media Section with Double-tap Like */}
        <div
          className="relative aspect-square"
          onDoubleClick={() => !isLiked && handleLike()}
        >
          <img
            src={post.content.media}
            alt=""
            className="w-full h-full object-cover"
          />
          <AnimatePresence>
            {/* Double-tap heart animation */}
            {isLiked && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Heart className="h-24 w-24 text-red-500 fill-red-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Actions Bar */}
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleLike}
                className={`flex items-center gap-2 ${
                  isLiked ? "text-red-500" : ""
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                <span>{likesCount}</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => setShowComments(true)}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{comments.length}</span>
              </motion.button>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark
                  className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
                />
              </motion.button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" /> Share Post
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigator.clipboard.writeText(window.location.href)
                    }
                  >
                    <Link className="h-4 w-4 mr-2" /> Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">
                    <Flag className="h-4 w-4 mr-2" /> Report Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Comments Section */}
          <Dialog open={showComments} onOpenChange={setShowComments}>
            <DialogContent className="sm:max-w-[500px] h-[80vh]">
              <DialogHeader>
                <DialogTitle>Comments</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 p-2 hover:bg-muted/50 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-sm">
                            {comment.user}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment.time}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="flex-1 resize-none"
                      rows={1}
                    />
                    <Button onClick={handleComment} disabled={!comment.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Share Dialog */}
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Post</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-4 gap-4 py-4">
                {/* Add social share buttons */}
              </div>
            </DialogContent>
          </Dialog>

          {/* Caption */}
          <p className="text-sm">
            <span className="font-medium">{post.artist.name}</span>{" "}
            {post.content.caption}
          </p>

          {/* Time */}
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.content.time}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

const FollowArtist = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <EmptyState
        icon={UserPlus}
        title="Discover Artists"
        description="Start following artists to see their content here!"
        action={
          <Button onClick={() => navigate("/customer/search")}>
            Find Artists
          </Button>
        }
      />
    </div>
  );
};

export default FollowArtist;
