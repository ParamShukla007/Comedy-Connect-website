import { Venue } from "../models/venue.models.js";
import {Event} from "../models/event.models.js";
import { Admin } from "../models/admin.models.js";
import mongoose from "mongoose";
import crypto from "crypto";

// Function to auto-generate seat arrangements
const generateSeats = (seatSet) => {
    console.log(seatSet);
    const seats = [];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // For row labels

    for (let r = 0; r < seatSet.rows; r++) {
        for (let c = 1; c <= seatSet.columns; c++) {
            seats.push({
                seatNumber: `${alphabet[r]}${c}`, // Example: A1, B3
                row: alphabet[r], // A, B, C...
                column: c, // 1, 2, 3...
                isBooked: false,
                bookedBy: null,
                status: "available"
            });
        }
    }

    return seats;
};


const getSimilarVenues = async (req, res) => {
    try {
        const { eventId } = req.body;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found." });
        }

        // Find venues that match the event type
        const venues = await Venue.find({
            venueTypes: { $in: [event.eventType] } // Match venues where venueTypes array contains the eventType
        })
        .populate("managerId", "name email")
        .populate("Reviews");

        if (!venues.length) {
            return res.status(404).json({ 
                success: false, 
                message: "No venues found matching the event type." 
            });
        }

        res.status(200).json({ 
            success: true, 
            venues: filteredVenues,
            eventType: event.eventType // Include event type in response for reference
        });

    } catch (error) {
        console.error("Error fetching similar venues:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error while fetching similar venues." 
        });
    }
};

// Controller to register a venue
const registerVenue = async (req, res) => {
    try {
        const { managerId, name, address, capacity, seatLayout, amenities, availabilitySchedule, venueTypes, description, images } = req.body;

        // Generate seats dynamically for each section
        const processedSeatLayout = seatLayout.map(section => ({
            ...section,
            seats: generateSeats(section) // Ensure seats are created
        }));

        // Create venue document
        const newVenue = new Venue({
            managerId,
            name,
            address,
            capacity,
            seatLayout: processedSeatLayout,
            amenities,
            availabilitySchedule,
            venueTypes,
            description,
            images,
            status: "pending_approval",
        });

        await newVenue.save(); // Save to database

        return res.status(201).json({
            success: true,
            message: "Venue registered successfully and pending admin approval!",
            venue: newVenue
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error registering venue",
            error: error.message
        });
    }
};

// Controller to approve a venue by admin
const approveVenueByAdmin = async (req, res) => {
    try {
        const { venueId } = req.body;

        if (!venueId) {
            return res.status(404).json({ message: "Invalid venueId" });
        }

        const admin = await Admin.findById(req.user?._id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const venue = await Venue.findById(venueId);
        if (!venue) {
            return res.status(404).json({ message: "Venue not found" });
        }

        // Check if venue is already approved
        if (venue.status === "approved_by_admin") {
            return res.status(400).json({ message: "Venue is already approved by admin" });
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');

        // Update the venue status and approval details
        venue.status = "approved_by_admin";
        venue.verificationToken = verificationToken;
        venue.approvalDate = new Date();
        venue.approvedBy = req.user?._id; // Store the admin ID who approved the venue

        await venue.save();

        res.status(200).json({
            message: "Venue has been successfully approved by admin and verification token sent to venue manager",
            venue,
        });
    } catch (error) {
        console.error("Error approving venue:", error);
        res.status(500).json({ message: "Failed to approve venue", error: error.message });
    }
};

// Controller to verify a venue by venue manager
const verifyVenue = async (req, res) => {
    try {
        const { venueId, verificationToken } = req.body;
        const userId = req.user?._id;
        if(!userId) {
            return res.status(401).json({ message: "Unauthorized request" });
        }
        if (!venueId || !verificationToken) {
            return res.status(400).json({ message: "Venue ID and verification token are required" });
        }

        const venue = await Venue.findById(venueId);
        if (!venue) {
            return res.status(404).json({ message: "Venue not found" });
        }

        if (venue.managerId.toString() !== userId.toString()) {
            return res.status(401).json({ message: "Unauthorized request" });
        }

        if (venue.verificationToken !== verificationToken) {
            return res.status(400).json({ message: "Invalid verification token" });
        }

        // Update the venue status to approved
        venue.status = "approved";
        venue.verificationToken = null; // Clear the verification token

        await venue.save();

        res.status(200).json({
            message: "Venue has been successfully verified and registered",
            venue,
        });
    } catch (error) {
        console.error("Error verifying venue:", error);
        res.status(500).json({ message: "Failed to verify venue", error: error.message });
    }
};

// Get all venue details with populated references
const getAllVenues = async (req, res) => {
    try {
        const venues = await Venue.find()
            .populate("managerId", "name email") // Populate manager details with selected fields
            .populate("Reviews"); // Populate reviews if available

        if (!venues.length) {
            return res.status(404).json({ success: false, message: "No venues found." });
        }

        res.status(200).json({ success: true, venues });
    } catch (error) {
        console.error("Error fetching venues:", error);
        res.status(500).json({ success: false, message: "Server error while fetching venues." });
    }
};


const bookVenue = async (req, res) => {
    const { eventId, venueId } = req.body;
    const { startTime, endTime } = req.body;

    try {
        // 1️⃣ Check if event exists
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found." });

        // 2️⃣ Check if venue exists
        const venue = await Venue.findById(venueId);
        if (!venue) return res.status(404).json({ message: "Venue not found." });

        // 3️⃣ Validate start and end time
        if (!startTime || !endTime) {
            return res.status(400).json({ message: "Start time and end time are required for booking." });
        }

        if (startTime >= endTime) {
            return res.status(400).json({ message: "End time must be after start time." });
        }

        // 4️⃣ Check for time slot conflicts
        const conflictingEvent = await Event.findOne({
            venueId: venueId,
            eventDate: event.eventDate,
            $or: [
                {
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime },
                },
            ],
            status: { $in: ["approved", "pending_approval"] },
        });

        if (conflictingEvent) {
            return res.status(400).json({
                message: "Venue is already booked for this time slot.",
            });
        }

        // 5️⃣ Update event with venue details, startTime, endTime, and status
        event.venueId = venueId;
        event.startTime = startTime;
        event.endTime = endTime;
        event.status = "pending_approval"; // Assuming approval is needed
        await event.save();

        res.status(200).json({
            message: "Venue booked successfully and pending approval.",
            event,
        });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ message: "Error booking venue.", error: error.message });
    }
};

// Get all pending venue proposals for admin
const getPendingVenues = async (req, res) => {
    try {
        const pendingVenues = await Venue.find({ status: "pending_approval" })
            .populate("managerId", "name email") // Populate manager details
            .select("name address capacity managerId status amenities venueTypes images"); // Select necessary fields

        res.status(200).json({
            success: true,
            data: pendingVenues,
            message: "Pending venues fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching pending venues:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching pending venues",
            error: error.message
        });
    }
};

const rejectVenue = async (req, res) => {
    try {
        const { venueId, rejectionReason } = req.body;
        const userId = req.user?._id;

        const admin = await Admin.findById(userId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const venue = await Venue.findById(venueId);
        if (!venue) {
            return res.status(404).json({ message: "Venue not found" });
        }

        if (venue.status === "approved_by_admin") {
            return res.status(400).json({ message: "Venue is already approved" });
        }

        // Update the venue status and rejection details
        venue.status = "rejected";
        venue.rejectionReason = rejectionReason;
        venue.rejectedBy = userId;
        venue.rejectionDate = new Date();

        await venue.save();

        res.status(200).json({
            success: true,
            message: "Venue has been successfully rejected",
            venue,
        });
    } catch (error) {
        console.error("Error rejecting venue:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to reject venue", 
            error: error.message 
        });
    }
};

export { getSimilarVenues, registerVenue, approveVenueByAdmin, verifyVenue, getAllVenues, bookVenue, getPendingVenues, rejectVenue };
