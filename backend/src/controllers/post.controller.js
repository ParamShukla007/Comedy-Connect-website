import { ArtistPost } from "../models/post.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// 🎨 Create a new post for an artist
 const createPost = async (req, res, next) => {
    try {
        const { artistId, caption, url } = req.body;

        if (!mongoose.Types.ObjectId.isValid(artistId)) {
            throw new ApiError(400, "Invalid artist ID");
        }
        // Check if an entry already exists for this artist
        let artistPost = await ArtistPost.findOne({ artist: artistId });

        if (!artistPost) {
            // If no entry exists, create a new one
            artistPost = await ArtistPost.create({
                artist: artistId,
                posts: [{ caption, url }],
            });
        } else {
            // If entry exists, push a new post to the posts array
            artistPost.posts.push({ caption, url });
            await artistPost.save();
        }

        res
            .status(201)
            .json(new ApiResponse(201, artistPost, "Post created successfully"));
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};

// 🎬 Get all posts for a specific artist
 const getPosts = async (req, res, next) => {
    try {
        const { artistId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(artistId)) {
            throw new ApiError(400, "Invalid artist ID");
        }

        // Fetch only the posts array from the document
        const artistPost = await ArtistPost.findOne({ artist: artistId }).select("posts");

        if (!artistPost || artistPost.posts.length === 0) {
            return res
                .status(404)
                .json(new ApiResponse(404, [], "No posts found for this artist"));
        }

        res
            .status(200)
            .json(new ApiResponse(200, artistPost.posts, "Artist posts fetched successfully"));
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};


// ❤️ Increment like count for a specific post
const likePost = async (req, res, next) => {
    try {
        const { artistId, postId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(artistId) || !mongoose.Types.ObjectId.isValid(postId)) {
            throw new ApiError(400, "Invalid artist or post ID");
        }

        const updatedPost = await ArtistPost.findOneAndUpdate(
            { artist: artistId, "posts._id": postId },
            { $inc: { "posts.$.likes": 1 } }, // Increment likes by 1
            { new: true }
        ).select("posts");

        if (!updatedPost) {
            throw new ApiError(404, "Post not found");
        }

        res
            .status(200)
            .json(new ApiResponse(200, updatedPost, "Like count incremented successfully"));
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};

// 💬 Add a comment to a specific post
const commentOnPost = async (req, res, next) => {
    try {
        const { artistId, postId } = req.body;
        const { comment } = req.body;
        const userId = req.user._id; // Assuming user ID comes from authentication middleware

        if (!mongoose.Types.ObjectId.isValid(artistId) || !mongoose.Types.ObjectId.isValid(postId)) {
            throw new ApiError(400, "Invalid artist or post ID");
        }

        if (!comment) {
            throw new ApiError(400, "Comment cannot be empty");
        }

        const updatedPost = await ArtistPost.findOneAndUpdate(
            { artist: artistId, "posts._id": postId },
            {
                $push: {
                    "posts.$.comments": {
                        user: userId,
                        comment: comment,
                    },
                },
            },
            { new: true }
        ).populate("posts.comments.user", "username"); // Populating username for comments

        if (!updatedPost) {
            throw new ApiError(404, "Post not found");
        }

        res
            .status(200)
            .json(new ApiResponse(200, updatedPost, "Comment added successfully"));
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};

const getFollowedArtistsPosts = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid user ID");
        }

        // 🕵️‍♂️ Find all artists followed by the user
        const followedArtists = await Followers.findOne({ user: userId }).select("artist");

        if (!followedArtists || followedArtists.artist.length === 0) {
            return res
                .status(404)
                .json(new ApiResponse(404, [], "User is not following any artists"));
        }

        // 🎨 Fetch only the posts from all followed artists
        const postsData = await ArtistPost.find({
            artist: { $in: followedArtists.artist },
        }).select("posts -_id"); // 📌 Select only the posts field, excluding _id

        // 📝 Flatten the posts array from all documents into a single array
        const allPosts = postsData.flatMap((artist) => artist.posts);

        if (!allPosts || allPosts.length === 0) {
            return res
                .status(404)
                .json(new ApiResponse(404, [], "No posts found for followed artists"));
        }

        res
            .status(200)
            .json(new ApiResponse(200, allPosts, "Posts from followed artists fetched successfully"));
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};

export { createPost, getPosts, likePost, commentOnPost, getFollowedArtistsPosts };