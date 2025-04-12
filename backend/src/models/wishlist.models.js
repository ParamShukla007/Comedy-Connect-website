import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        events: [
            {
                type: Schema.Types.ObjectId,
                ref: "Event",
            },
        ],
    },
    { timestamps: true }
);

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
