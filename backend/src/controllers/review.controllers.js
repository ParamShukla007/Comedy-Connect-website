import { Review } from "../models/review.models.js";
import { Artist } from "../models/artist.models.js";
import { Venue } from "../models/venue.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Utility to calculate and update average rating and total reviews
const updateRatingStats = async (model, modelId, isArtist = true) => {
    const reviews = await Review.find(isArtist ? { artistId: modelId } : { venueId: modelId });
    const totalReviews = reviews.length;
    const averageRating = totalReviews === 0 ? 0 : reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews;

    await model.findByIdAndUpdate(modelId, {
        average_Rating: averageRating,
        total_reviews: totalReviews,
    });
};

// 🎨 1) Rate an Artist
 const rateArtist = async (req, res, next) => {
    try {
        const { artistId, rating, review_desc } = req.body;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(artistId)) throw new ApiError(400, "Invalid artist ID");
        if (rating < 0 || rating > 5) throw new ApiError(400, "Rating must be between 0 and 5");

        const review = await Review.create({ artistId, userId, rating, review_desc });
        await updateRatingStats(Artist, artistId, true);

        res.status(201).json(new ApiResponse(201, review, "Artist rated successfully"));
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};

// 🏛️ 2) Rate a Venue
 const rateVenue = async (req, res, next) => {
    try {
        const { venueId, rating, review_desc } = req.body;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(venueId)) throw new ApiError(400, "Invalid venue ID");
        if (rating < 0 || rating > 5) throw new ApiError(400, "Rating must be between 0 and 5");

        const review = await Review.create({ venueId, userId, rating, review_desc });
        await updateRatingStats(Venue, venueId, false);

        res.status(201).json(new ApiResponse(201, review, "Venue rated successfully"));
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};

// 🎤 3) Fetch Artist Reviews
 const getArtistReviews = async (req, res, next) => {
    try {
        const { artistId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(artistId)) throw new ApiError(400, "Invalid artist ID");

        const reviews = await Review.find({ artistId }).populate("userId", "username");
        res.status(200).json(new ApiResponse(200, reviews, "Artist reviews fetched successfully"));
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};

// 🏟️ 4) Fetch Venue Reviews
 const getVenueReviews = async (req, res, next) => {
    try {
        const { venueId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(venueId)) throw new ApiError(400, "Invalid venue ID");

        const reviews = await Review.find({ venueId }).populate("userId", "username");
        res.status(200).json(new ApiResponse(200, reviews, "Venue reviews fetched successfully"));
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};

const getUserReviews = async (req, res, next) => {
    try {
        const userId = req.body;
        if (!mongoose.Types.ObjectId.isValid(userId)) throw new ApiError(400, "Invalid user ID");

        const reviews = await Review.find({ userId })
            .populate("artistId", "fullName")
            .populate("venueId", "name");

        res.status(200).json(new ApiResponse(200, reviews, "User reviews fetched successfully"));
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};

export { rateArtist, rateVenue, getArtistReviews, getVenueReviews, getUserReviews };