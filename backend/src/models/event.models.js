import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
    {
        venueId: { 
            type: Schema.Types.ObjectId, 
            ref: "Venue",
            required: true
        },
        primaryArtistId: { 
            type: Schema.Types.ObjectId, 
            ref: "Artist",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        eventType: { 
            type: String, 
            enum: ['standup', 'improv', 'sketch', 'open_mic', 'festival', 'workshop', 'other'],
            required: true
        },
        eventDate: {
            type: Date, 
            required: true
        },
        startTime: { 
            type: String, 
            required: true 
        },
        endTime: { 
            type: String, 
            required: true 
        },
        status: { 
            type: String, 
            enum: ['pending_approval', 'approved_by_admin', 'negotiation_pending', 'approved', 'rejected', 'cancelled', 'completed'],
            default: 'pending_approval'
        },
        rejectionReason: {
            type: String,
        },
        minAge: { 
            type: Number,
            default: 18 
        },
        genres: [String],
        tags: [String],
        mediaAssets: {
            thumbnailUrl: String,
            bannerImageUrl: String,
            promotionalVideoUrl: String,
            galleryImages: [String]
        },
        proposedPrice: {
            type: Number,
        },
        percentageCommission: {
            type: Number,
        },
        isApproved:{
            type: Boolean,
            default: false
        },
        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin", // Assuming admin is also stored in the User model
        },
        negotiationHistory: [
            {
                proposedBy: { type: String, enum: ["venueManager", "artist"], required: true },
                proposedPrice: Number,
                percentageCommission: Number,
                date: { type: Date, default: Date.now }
            }
        ],
        approvalDate: Date,
        analytics: {
            totalTicketsSold: { 
                type: Number, 
                default: 0 
            },
            revenueGenerated: { 
                type: Number, 
                default: 0 
            },
            audienceDemographics: {
                ageGroups: {
                    "18-24": Number,
                    "25-34": Number,
                    "35-44": Number,
                    "45-54": Number,
                    "55+": Number
                },
                genderDistribution: {
                    male: Number,
                    female: Number,
                    other: Number
                }
            }
        },
        seatPricing: [
            {
                seatSetName: {
                    type: String,
                    required: [true, "Seat set name is required"]
                }, 
                price: { 
                    type: Number, 
                    required: [true, "Price is required"],
                    min: [0, "Price cannot be negative"]
                },
                _id: false
            }
        ],
        bookedSeats: [
            {
                seatSetName: { 
                    type: String, 
                    required: true 
                },
                seatNumber: { 
                    type: String, 
                    required: true 
                }, 
                row: { 
                    type: String, 
                    required: true 
                },
                column: { 
                    type: Number, 
                    required: true 
                },
                bookedBy: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: "User", 
                    required: true 
                },
                status: { 
                    type: String, 
                    enum: ["pending", "booked"], 
                    default: "pending" 
                }
            }
        ],
        Reviews:[
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            }
        ],
    },
    { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
