import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Wishlist } from "../models/wishlist.models.js";

const createWishlist = asyncHandler(async (req, res) => {
    const { eventId } = req.body;
    const { userId } = req.body;

    if (!eventId || !userId) {
        throw new ApiError(400, "Event ID and User ID are required");
    }

    try {
        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            // Create new wishlist if it doesn't exist
            wishlist = await Wishlist.create({
                userId,
                events: [eventId]
            });
        } else {
            // Check if event already exists in wishlist
            if (wishlist.events.includes(eventId)) {
                return res
                    .status(200)
                    .json(new ApiResponse(200, wishlist, "Event already in wishlist"));
            }

            // Add event to existing wishlist
            wishlist.events.push(eventId);
            await wishlist.save();
        }

        // Populate event details before sending response
        const populatedWishlist = await Wishlist.findById(wishlist._id)
            .populate({
                path: "events",
                populate: {
                    path: "venueId",
                    select: "name address location capacity"
                }
            })
            .populate("userId", "username email");

        return res
            .status(200)
            .json(new ApiResponse(200, populatedWishlist, "Event added to wishlist successfully"));

    } catch (error) {
        throw new ApiError(500, "Error creating/updating wishlist: " + error.message);
    }
});

const getAllWishlists = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    try {
        const wishlist = await Wishlist.findOne({ userId })
            .populate({
                path: "events",
                populate: [{
                    path: "venueId",
                    select: "name address location capacity"
                }, {
                    path: "primaryArtistId",
                    select: "fullName stageName profile_image"
                }],
                // Add selection for event time and price fields
                select: "title description startDate endDate eventTime seatPricing status"
            })
            .populate("userId", "username email");

        if (!wishlist) {
            return res
                .status(200)
                .json(new ApiResponse(200, [], "No wishlist found"));
        }

        // Format response with nested details including time and price
        const formattedWishlist = {
            ...wishlist.toObject(),
            events: wishlist.events.map(event => ({
                description: event.description,
                eventDate: event.eventDate,
                venue: {
                    name: event.venueId?.name,
                    address: event.venueId?.address,
                    location: event.venueId?.location,
                    capacity: event.venueId?.capacity
                },
                artist: {
                    name: event.primaryArtistId?.fullName,
                    stageName: event.primaryArtistId?.stageName,
                    profileImage: event.primaryArtistId?.profile_image
                }
            }))
        };

        return res
            .status(200)
            .json(new ApiResponse(200, formattedWishlist, "Wishlists fetched successfully"));

    } catch (error) {
        throw new ApiError(500, "Error fetching wishlist: " + error.message);
    }
});


export { createWishlist, getAllWishlists };