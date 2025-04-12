import mongoose, { Schema } from "mongoose";

const generateSeats = (section) => {
    const seats = [];
    const totalSeats = section.rows * section.columns;
    
    for (let i = 0; i < totalSeats; i++) {
        const row = Math.floor(i / section.columns) + 1;
        const column = (i % section.columns) + 1;
        const seatNumber = i + 1;
        
        seats.push({
            seatNumber: seatNumber.toString(),
            row,
            column,
            isBooked: false,
            status: "available",
            bookedBy: null
        });
    }
    
    return seats;
};

const seatSchema = new Schema(
    {
        name: {
            type: String, 
            required: true,
        },
        priority: {
            type: Number, 
            required: true 
        },
        rows: { 
            type: Number, 
            required: true 
        }, 
        columns: { 
            type: Number, 
            required: true 
        }, 
        seats: [
            {
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
                isBooked: { 
                    type: Boolean, 
                    default: false 
                }, 
                bookedBy: { 
                    type: Schema.Types.ObjectId, 
                    ref: "User", 
                    default: null 
                }, 
                status: { 
                    type: String, 
                    enum: ["available", "pending", "booked"], 
                    default: "available" 
                } 
            }
        ]
    
    }
);

const venueSchema = new Schema(
    {
        managerId: { 
            type: Schema.Types.ObjectId, 
            ref: "VenueManager",
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            pincode: { type: String, trim: true },
            latitude: { type: String },
            longitude: { type: String }
        },
        capacity: { 
            type: Number, 
            required: true 
        },
        seatLayout: [seatSchema],
        amenities: [
            {
                type: String,
                required: true,
            }
        ],
        availabilitySchedule: {
            regularHours: [
                {
                    dayOfWeek: Number, 
                    startTime: String, 
                    endTime: String,
                    isAvailable: Boolean
                }
            ],
        },
        venueTypes: [
            {
                name: { 
                    type: String, 
                    required: true 
                },
                description: {
                    type: String
                } 
            }
        ],
        description: {
            type: String,
            required: true
        },
        images: [
            {
                type: String, //image url
                required: true,
            }
        ],
        Reviews:[
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            }
        ],
        status: {
            type: String,
            enum: ['pending_approval', 'approved_by_admin', 'approved', 'rejected'],
            default: 'pending_approval'
        },
        verificationToken: {
            type: String,
            default: null
        },
        isActive: {
            type: Boolean, 
            default: true 
        },
    },
    { timestamps: true }
);

venueSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('seatLayout')) {
        this.seatLayout = this.seatLayout.map(section => ({
            ...section,
            seats: generateSeats({
                rows: section.rows,
                columns: section.columns
            })
        }));
    }
    next();
});

export const Venue = mongoose.model("Venue", venueSchema);
