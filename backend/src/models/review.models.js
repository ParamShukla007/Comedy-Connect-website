import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        artistId: {
            type: Schema.Types.ObjectId,
            ref: 'Artist',
        },
        venueId: {
            type: Schema.Types.ObjectId,
            ref: 'Venue',
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            default:0,
            min: 0,
            max: 5,
            required: true
        },
        average_Rating: {
            type: Number,
            default:0,
            required: true
        },
        total_reviews: {
            type: Number,
            default:0,
            required: true
        },
        review_desc: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Review = mongoose.model('Review', reviewSchema);