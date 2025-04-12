import { Event } from "../models/event.models.js";
import { Admin } from "../models/admin.models.js";
import { VenueManager } from "../models/venueManager.models.js";
import mongoose from "mongoose";

const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            eventType,
            eventDate,
            minAge,
            genres,
            tags,
            mediaAssets,
            proposedPrice,
            percentageCommission,
            venueId,
            seatPricing,
            startTime,
            endTime,
        } = req.body;

        // Validate required fields
        if (!title || !description || !eventType || !eventDate || !minAge || !mediaAssets || !venueId || !startTime || !endTime) {
            return res.status(400).json({ success: false, message: "Please provide all required fields." });
        }

        // Check for time slot conflicts
        const conflictingEvent = await Event.findOne({
            venueId,
            eventDate,
            status: { $in: ["approved", "negotiation_pending", "pending_approval", "approved_by_admin"] },
            $or: [
                {
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime }
                }
            ]
        });

        if (conflictingEvent) {
            return res.status(409).json({
                success: false,
                message: "This venue is already booked for this time slot",
                conflictDetails: {
                    existingEvent: conflictingEvent.title,
                    date: conflictingEvent.eventDate,
                    time: `${conflictingEvent.startTime} - ${conflictingEvent.endTime}`
                }
            });
        }

        // Create the event
        const event = await Event.create({
            primaryArtistId: req.user._id, // Assuming authentication middleware sets req.user
            title,
            description,
            eventType,
            eventDate,
            minAge,
            genres,
            tags,
            mediaAssets,
            proposedPrice,
            percentageCommission,
            venueId,
            seatPricing,
            startTime,
            endTime,
            status: "pending_approval",
            negotiationHistory: [],
        });

        res.status(201).json({
            message: "Event registered successfully and pending admin approval!",
            event,
        });
    } catch (error) {
        console.error("Event creation error:", error);
        res.status(500).json({ success: false, message: "Error creating event.", error: error.message });
    }
};

const getEventDetails = async (req, res) => {
    try {
        const { id } = req.body;

        const event = await Event.findById(id)
            .populate({
                path: "primaryArtistId",
                select: "fullName"
            })
            .populate({
                path: "venueId",
                select: "name address"
            })
            .select(
                "title description eventType eventDate startTime endTime minAge genres tags mediaAssets seatPricing"
            );

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Failed to get event details", error: error.message });
    }
};

const approveEventByAdmin = async (req, res) => {
    try {

        const { eventId } = req.body;
        const adminId = req.user?._id;
        console.log(req.user)
        if(!eventId){
            return res.status(404).json({ message: "Invalid eventId" });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if event is already approved
        if (event.status === "approved_by_admin") {
            return res.status(400).json({ message: "Event is already approved by admin" });
        }

        // Update the event status and approval details
        event.status = "approved_by_admin";
        event.isApproved = true;
        event.approvalDate = new Date();
        event.approvedBy = req.user?._id; // Store the admin ID who approved the event

        await event.save();

        res.status(200).json({
            message: "Event has been successfully approved by admin and forwarded to venue manager",
            event,
        });
    } catch (error) {
        console.error("Error approving event:", error);
        res.status(500).json({ message: "Failed to approve event", error: error.message });
    }
};

const approveEventByVenueManager = async (req, res) => {
    try {

        const { eventId } = req.body;

        if(!eventId){
            return res.status(404).json({ message: "Invalid eventId" });
        }

        const venueManager = await VenueManager.findById(req.user?._id);
        if (!venueManager) {
            return res.status(404).json({ message: "Venue Manager not found" });
        }

        // Find the event by ID
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if event is already approved
        if (event.status === "approved") {
            return res.status(400).json({ message: "Event is already approved" });
        }

        // Update the event status and approval details
        event.status = "approved";
        event.isApproved = true;
        event.approvalDate = new Date();
        event.approvedBy = req.user?._id; // Store the venue manager ID who approved the event

        await event.save();

        res.status(200).json({
            message: "Event has been successfully approved by venue manager and is now listed",
            event,
        });
    } catch (error) {
        console.error("Error approving event:", error);
        res.status(500).json({ message: "Failed to approve event", error: error.message });
    }
};

const rejectEvent = async (req, res) => {
    try {
 
        const { eventId, rejectionReason } = req.body;
        const userId = req.user?._id;

        const admin = await Admin.findById(userId)
        const venueManager = await VenueManager.findById(userId)
        if (!admin && !venueManager) {
            return res.status(404).json({ message: "Admin and Venue Manager not found" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if(event.status === "approved"){
            return res.status(400).json({ message: "Event is already approved" });
        }
        // Update the event status and rejection details
        event.status = "rejected";
        event.rejectionReason = rejectionReason;

        await event.save();

        res.status(200).json({
            message: "Event has been successfully rejected",
            event,
        });
    } catch (error) {
        console.error("Error rejecting event:", error);
        res.status(500).json({ message: "Failed to reject event", error: error.message });
    }
};

const filterEventsByType = async (req, res) => {
    try {
        const { eventType } = req.body;

        if (!eventType) {
            return res.status(400).json({ message: "eventType query parameter is required." });
        }

        const filteredEvents = await Event.find({ eventType });

        if (filteredEvents.length === 0) {
            return res.status(404).json({ message: "No events found for the specified eventType." });
        }

        res.status(200).json(filteredEvents);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error: error.message });
    }
};

const getEventsByDate = async (req, res) => {
    try {
        const { date, status } = req.body;

        // Check if date is provided
        if (!date) {
            return res.status(400).json({ message: "Date is required to fetch events." });
        }

        // Create date range for the entire day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Create the query object
        const query = {
            eventDate: { $gte: startOfDay, $lte: endOfDay },
        };

        // Add status to the query if provided
        if (status) {
            query.status = status;
        }

        // Fetch events based on the query
        const events = await Event.find(query)
            .populate({
                path: "primaryArtistId",
                select: "fullName"
            })
            .select(
                "title description eventType eventDate startTime endTime minAge genres tags mediaAssets seatPricing status"
            );

        // If no events are found
        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found for the given date." });
        }

        // Return the list of events
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events by date:", error);
        res.status(500).json({ message: "Failed to get events by date.", error: error.message });
    }
};

const getPendingEventsAdmin = async (req, res) => {
    try {
        const pendingEvents = await Event.find({ status: "pending_approval" })
            .populate("primaryArtistId", "fullName")
            .populate("venueId", "name address");

        res.status(200).json({ success: true, data: pendingEvents });
    } catch (error) {
        console.error("Error fetching pending events for admin:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
const getPendingEventsVenueManager = async (req, res) => {
    try {
        const { venueId } = req.body; // Destructure venueId from request body
        console.log('Venue ID:', venueId); // Add debugging log

        if (!venueId) {
            return res.status(400).json({ 
                success: false, 
                message: "Venue ID is required" 
            });
        }

        const pendingEvents = await Event.find({ 
            status: "approved_by_admin", 
            venueId: venueId  // Use the venueId from request body
        })
        .populate("primaryArtistId", "fullName")
        .populate("venueId", "name address");

        console.log('Found events:', pendingEvents); // Add debugging log

        res.status(200).json({ 
            success: true, 
            data: pendingEvents,
            message: "Pending events fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching pending events for venue manager:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error",
            error: error.message 
        });
    }
};

const getEventById = async (req, res) => {
    try {
        const { eventId } = req.params;

        const eventDetails = await Event.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(eventId) } },
            {
                $lookup: {
                    from: "artists",
                    localField: "primaryArtistId",
                    foreignField: "_id",
                    as: "artistDetails"
                }
            },
            {
                $lookup: {
                    from: "venues",
                    localField: "venueId",
                    foreignField: "_id",
                    as: "venueDetails"
                }
            },
            { $unwind: "$artistDetails" },
            { $unwind: "$venueDetails" },
            {
                $project: {
                    title: 1,
                    description: 1,
                    eventType: 1,
                    eventDate: 1,
                    startTime: 1,
                    endTime: 1,
                    minAge: 1,
                    genres: 1,
                    tags: 1,
                    mediaAssets: 1,
                    proposedPrice: 1,
                    status: 1,
                    negotiationHistory: 1,
                    approvalDate: 1,
                    artistDetails: {
                        fullName: 1,
                        email: 1,
                        phone_no: 1,
                        stageName: 1,
                        bio: 1,
                        yearsExperience: 1,
                        genre: 1,
                        socialMedia: 1
                    },
                    venueDetails: {
                        name: 1,
                        address: 1,
                        capacity: 1,
                        amenities: 1,
                        description: 1,
                        images: 1
                    }
                }
            }
        ]);

        if (!eventDetails.length) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        res.status(200).json({ success: true, data: eventDetails[0] });
    } catch (error) {
        console.error("Error fetching event details:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const proposeNegotiation = async (req, res) => {
    try {
        const { eventId, newProposedPrice, newPercentageCommission } = req.body;
        const venueManager = await VenueManager.findById(req.user?._id);

        if (!venueManager) {
            return res.status(404).json({ message: "Venue Manager not found" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.status !== "approved_by_admin") {
            return res.status(400).json({ message: "Event is not in a negotiable state" });
        }

        event.status = "negotiation_pending";
        event.negotiationHistory.push({
            proposedBy: "venueManager",
            proposedPrice: newProposedPrice,
            percentageCommission: newPercentageCommission,
            date: new Date()
        });
        
        await event.save();
        res.status(200).json({ message: "Negotiation request sent", event });
    } catch (error) {
        console.error("Error proposing negotiation:", error);
        res.status(500).json({ message: "Failed to propose negotiation", error: error.message });
    }
};

const respondToNegotiation = async (req, res) => {
    try {
        const { eventId, response, counterProposedPrice, counterPercentageCommission } = req.body;
        const event = await Event.findById(eventId);
        
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.status !== "negotiation_pending") {
            return res.status(400).json({ message: "No active negotiation for this event" });
        }

        if (response === "accept") {
            event.status = "approved";
            event.isApproved = true;
            event.approvalDate = new Date();
            event.approvedBy = req.user?._id;
        } else if (response === "reject") {
            event.status = "approved_by_admin";
        } else if (response === "counter") {
            event.negotiationHistory.push({
                proposedBy: "artist",
                proposedPrice: counterProposedPrice,
                percentageCommission: counterPercentageCommission,
                date: new Date()
            });
        }

        await event.save();
        res.status(200).json({ message: "Negotiation response recorded", event });
    } catch (error) {
        console.error("Error responding to negotiation:", error);
        res.status(500).json({ message: "Failed to respond to negotiation", error: error.message });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate("primaryArtistId", "fullName")
            .populate("venueId", "name address");

        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found." });
        }

        res.status(200).json({ success: true, data: events });
    } catch (error) {
        console.error("Error fetching all events:", error);
        res.status(500).json({ success: false, message: "Failed to fetch all events", error: error.message });
    }
};


export { getAllEvents, createEvent, getEventDetails, approveEventByAdmin, approveEventByVenueManager, rejectEvent, getEventsByDate, filterEventsByType, getPendingEventsAdmin, getPendingEventsVenueManager, getEventById, proposeNegotiation, respondToNegotiation };