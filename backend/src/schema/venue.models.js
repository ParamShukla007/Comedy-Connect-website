import mongoose, { Schema } from "mongoose";

const VenueSchema = new mongoose.Schema({
    managerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Location_manager',
      required: true
    },
    name: { 
        type: String, 
        required: true 
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true },
        latitude: { type: String },
        longitude: { type: String },
    },
    capacity: { 
        type: Number, 
        required: true 
    },
    amenities: [{
        name: String,
    }],
    venueTypes: [{
        name: String,
    }], // e.g., ["comedy club", "theater", "bar"]
    description: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }], // URLs to images
    floorPlanUrl: {
        type: String,
        required: true
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    availabilitySchedule: {
      // Complex structure for recurring and specific availability
      regularHours: [{
        dayOfWeek: Number, // 0-6 (Sunday-Saturday)
        startTime: String, // HH:MM format
        endTime: String,
        isAvailable: Boolean
      }],
      specialDates: [{
        date: Date,
        startTime: String,
        endTime: String,
        isAvailable: Boolean,
        note: String
      }]
    },
    rentalFeeStructure: {
      basePrice: Number,
      currency: { type: String, default: 'INR' },
      additionalFees: [{
        name: String,
        amount: Number,
        description: String
      }]
    },
    averageRating: { 
        type: Number, 
        default: 0 
    },
    totalReviews: { 
        type: Number, 
        default: 0 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Venue = mongoose.model("Venue", VenueSchema);

