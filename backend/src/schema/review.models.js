import mongoose, { Schema } from "mongoose";

const review_schema = new Schema(
    {
        artistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Artist',
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
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

const Review = mongoose.model('Review', review_schema);
export default Review;