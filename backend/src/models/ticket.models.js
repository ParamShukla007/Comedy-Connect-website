import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        venueId: {
            type: Schema.Types.ObjectId,
            ref: "Venue",
            required: true,
        },
        seatNumber: {
            type: String,
            required: true,
        },
        row: {
            type: Number,
            required: true,
        },
        column: {
            type: Number,
            required: true,
        },
        seatSetName: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        bookingStatus: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "checked_in"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: ["credit_card", "debit_card", "upi", "net_banking", "wallet"],
        },
        transactionId: {
            type: String,
        },
        issuedAt: {
            type: Date,
            default: Date.now,
        },
        qrCode: {
            type: String,
        },
    },
    { timestamps: true }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
