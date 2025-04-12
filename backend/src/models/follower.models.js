import mongoose, { Schema } from "mongoose";

const followersSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        artist: [
            {
                type: Schema.Types.ObjectId,
                ref: "Artist",
            }
        ],
    },
    {
        timestamps: true,
    }
);

export const Followers = mongoose.model("Followers", followersSchema);