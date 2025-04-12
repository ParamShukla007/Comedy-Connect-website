import { Event } from "../models/event.models.js";
import { Venue } from "../models/venue.models.js";
import { Ticket } from "../models/ticket.models.js"; // Add this import
import { v4 as uuidv4 } from 'uuid'; // Add this for generating unique IDs

const bookTickets = async (req, res) => {
    try {
        const { 
            eventId, 
            userId, 
            selectedSeats // Array of {seatSetName, seatNumber}
        } = req.body;

        // 1. Validate event exists and is approved
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ 
                success: false, 
                message: "Event not found" 
            });
        }

        if (event.status !== 'approved') {
            return res.status(400).json({ 
                success: false, 
                message: "Event is not approved for ticket booking" 
            });
        }

        // 2. Get venue details with explicit seat layout population
        const venue = await Venue.findById(event.venueId).lean();
        if (!venue) {
            return res.status(404).json({ 
                success: false, 
                message: "Venue not found" 
            });
        }

        // Debug log
        console.log("Venue Seat Layout:", JSON.stringify(venue.seatLayout, null, 2));

        // 3. Validate and process each seat
        const bookedSeatsData = [];
        const ticketsData = []; // Array to store ticket documents
        let totalPrice = 0;

        for (const seat of selectedSeats) {
            // Find seat set in venue layout
            const seatSet = venue.seatLayout.find(s => s.name === seat.seatSetName);
            if (!seatSet) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Invalid seat set: ${seat.seatSetName}` 
                });
            }

            // Calculate seat index based on seat number
            const seatNumber = parseInt(seat.seatNumber);
            if (isNaN(seatNumber) || seatNumber < 1) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid seat number: ${seat.seatNumber}`
                });
            }

            // Convert seat number to row and column
            const row = Math.ceil(seatNumber / seatSet.columns);
            const column = ((seatNumber - 1) % seatSet.columns) + 1;
            
            // Convert numeric row to letter (A, B, C, etc.)
            const rowLetter = String.fromCharCode(64 + row); // 1 -> A, 2 -> B, etc.

            // Validate seat exists within bounds
            if (row > seatSet.rows || column > seatSet.columns) {
                return res.status(400).json({
                    success: false,
                    message: `Seat ${seatNumber} is out of bounds for ${seat.seatSetName}`
                });
            }

            // Check if seat is already booked
            const seatIndex = (row - 1) * seatSet.columns + (column - 1);
            const seatDetails = seatSet.seats[seatIndex];

            console.log(`Checking seat: ${seatNumber}, Row: ${row}, Column: ${column}, Index: ${seatIndex}`);
            console.log("Seat Details:", seatDetails);

            if (!seatDetails || seatDetails.isBooked) {
                return res.status(400).json({
                    success: false,
                    message: `Seat ${seat.seatNumber} in ${seat.seatSetName} is not available`
                });
            }

            // Find price for this seat set with better error handling
            const seatPrice = event.seatPricing?.find(sp => sp.seatSetName === seat.seatSetName);
            if (!seatPrice) {
                console.log("Available seat pricing:", event.seatPricing);
                console.log("Requested seat set:", seat.seatSetName);
                return res.status(400).json({ 
                    success: false, 
                    message: `Price not set for seat set: ${seat.seatSetName}. Available seat sets: ${event.seatPricing.map(sp => sp.seatSetName).join(', ')}` 
                });
            }

            totalPrice += seatPrice.price;

            // Generate QR code data (you'll need to implement actual QR generation)
            const qrCodeData = `${eventId}-${seat.seatNumber}-${uuidv4()}`;

            // Create ticket document
            const ticketData = {
                eventId,
                userId,
                venueId: event.venueId,
                seatNumber: seatDetails.seatNumber,
                row: rowLetter, // Use the letter row instead of numeric
                column: seatDetails.column,
                seatSetName: seat.seatSetName,
                price: seatPrice.price,
                bookingStatus: "confirmed",
                paymentStatus: "pending", // Update this based on your payment flow
                qrCode: qrCodeData,
                ticketFormat: "digital",
                isTransferable: true,
                expiryDate: event.eventDate, // Set expiry to event date
                validationHash: uuidv4() // Generate a unique validation hash
            };

            ticketsData.push(ticketData);

            // Prepare booking data
            bookedSeatsData.push({
                seatSetName: seat.seatSetName,
                seatNumber: seatDetails.seatNumber,
                row: seatDetails.row,
                column: seatDetails.column,
                bookedBy: userId,
                status: "booked"
            });
        }

        // Create tickets in bulk
        const createdTickets = await Ticket.insertMany(ticketsData);

        // 4. Update event with booked seats
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                $push: { 
                    bookedSeats: { $each: bookedSeatsData },
                    tickets: { $each: createdTickets.map(ticket => ticket._id) } // Add reference to tickets
                },
                $inc: { 
                    'analytics.totalTicketsSold': bookedSeatsData.length,
                    'analytics.revenueGenerated': totalPrice
                }
            },
            { new: true }
        );

        // 5. Update venue seat status with corrected query
        for (const seat of selectedSeats) {
            const seatNumber = parseInt(seat.seatNumber);
            const seatSet = venue.seatLayout.find(s => s.name === seat.seatSetName);
            const row = Math.ceil(seatNumber / seatSet.columns);
            const column = ((seatNumber - 1) % seatSet.columns) + 1;
            const seatIndex = (row - 1) * seatSet.columns + (column - 1);

            await Venue.updateOne(
                { _id: event.venueId },
                {
                    $set: {
                        [`seatLayout.$[section].seats.${seatIndex}.isBooked`]: true,
                        [`seatLayout.$[section].seats.${seatIndex}.bookedBy`]: userId,
                        [`seatLayout.$[section].seats.${seatIndex}.status`]: "booked"
                    }
                },
                {
                    arrayFilters: [
                        { "section.name": seat.seatSetName }
                    ]
                }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Tickets booked successfully",
            bookingDetails: {
                eventTitle: event.title,
                bookedSeats: bookedSeatsData,
                tickets: createdTickets, // Include ticket details in response
                totalPrice,
                bookingDate: new Date()
            }
        });

    } catch (error) {
        console.error("Error booking tickets:", error);
        return res.status(500).json({
            success: false,
            message: "Error processing ticket booking",
            error: error.message
        });
    }
};

// Get available seats for an event
const getAvailableSeats = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId)
            .populate('venueId');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const venue = event.venueId;
        const availableSeats = venue.seatLayout.map(seatSet => ({
            seatSetName: seatSet.name,
            price: event.seatPricing.find(sp => sp.seatSetName === seatSet.name)?.price,
            availableSeats: seatSet.seats.filter(seat => !seat.isBooked)
        }));

        return res.status(200).json({
            success: true,
            eventTitle: event.title,
            availableSeats
        });

    } catch (error) {
        console.error("Error fetching available seats:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching available seats",
            error: error.message
        });
    }
};

const getUserTickets = async (req, res) => {
    try {
        const {userId} = req.body; // Assuming using auth middleware

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const tickets = await Ticket.find({ userId })
            .select('seatNumber seatSetName') // Select only needed ticket fields
            .populate({
                path: 'eventId',
                select: 'title', // Only event name
            })
            .populate({
                path: 'venueId',
                select: 'name address', // Only venue name and address
            })
            .lean(); // Convert to plain JavaScript object

        const formattedResponse = {
            success: true,
            totalTickets: tickets.length,
            tickets: tickets.map(ticket => ({
                seatInfo: {
                    seatNumber: ticket.seatNumber,
                    section: ticket.seatSetName
                },
                eventName: ticket.eventId?.title,
                venue: {
                    name: ticket.venueId?.name,
                    address: ticket.venueId?.address
                }
            }))
        };

        return res.status(200).json(formattedResponse);

    } catch (error) {
        console.error("Error fetching user tickets:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching user tickets",
            error: error.message
        });
    }
};

const getVenueSeatLayout = async (req, res) => {
    try {
        const { eventId } = req.body;

        const event = await Event.findById(eventId)
            .populate({
                path: 'venueId',
                select: 'name seatLayout capacity'
            });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const venue = event.venueId;
        if (!venue) {
            return res.status(404).json({
                success: false,
                message: "Venue not found for this event"
            });
        }

        // Transform seat layout data to include pricing and availability
        const seatLayout = venue.seatLayout.map(section => {
            const sectionPrice = event.seatPricing.find(sp => 
                sp.seatSetName === section.name
            )?.price || 0;

            return {
                name: section.name,
                rows: section.rows,
                columns: section.columns,
                price: sectionPrice,
                seats: section.seats.map(seat => ({
                    ...seat,
                    isAvailable: !seat.isBooked,
                    price: sectionPrice
                })),
                capacity: section.rows * section.columns,
                availableSeats: section.seats.filter(seat => !seat.isBooked).length
            };
        });

        return res.status(200).json({
            success: true,
            data: {
                venueName: venue.name,
                totalCapacity: venue.capacity,
                layout: seatLayout,
                eventTitle: event.title,
                eventDate: event.eventDate,
                startTime: event.startTime
            }
        });

    } catch (error) {
        console.error("Error fetching venue seat layout:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching venue seat layout",
            error: error.message
        });
    }
};

// Update exports to include new controller
export { 
    bookTickets, 
    getAvailableSeats, 
    getUserTickets,
    getVenueSeatLayout 
};