import mongoose, { Schema } from "mongoose";

const complaintSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: String,
            enum: ["event", "venue", "ticket", "artist", "other"],
            required: true,
        },
        referenceId: {
            type: Schema.Types.ObjectId,
            required: function () {
                return this.category !== "other";
            },
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "in_progress", "resolved", "rejected"],
            default: "pending",
        },
        resolutionMessage: {
            type: String,
        },
        resolvedBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export const Complaint = mongoose.model("Complaint", complaintSchema);
