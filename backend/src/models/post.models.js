import mongoose, { Schema } from "mongoose";

const artistPostSchema = new Schema(
    {
        artist: {
            type: Schema.Types.ObjectId,
            ref: "Artist",
            required: true,
        },
        posts: [
            {
                caption: {
                    type: String,
                    trim: true,
                },
                url: {
                    type: String,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
                likes:{
                    type: Number,
                    default: 0,
                },
                comments: [
                    {
                        user: {
                            type: Schema.Types.ObjectId,
                            ref: "User",
                        },
                        comment: {
                            type: String,
                            trim: true,
                        },
                        createdAt: {
                            type: Date,
                            default: Date.now,
                        },
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const ArtistPost = mongoose.model("ArtistPost", artistPostSchema);
