import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Venue } from "../models/venue.models.js";
import { Artist } from "../models/artist.models.js";
import { Ticket } from "../models/ticket.models.js"; // Add this import

const getDashboardStats = asyncHandler(async (req, res) => {
    try {
        // Get counts from all collections
        const [userCount, venueCount, artistCount] = await Promise.all([
            User.countDocuments(),
            Venue.countDocuments(),
            Artist.countDocuments()
        ]);

        // Get recent registrations (last 7 days)
        const lastWeekDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        const [recentUsers, recentVenues, recentArtists] = await Promise.all([
            User.countDocuments({ createdAt: { $gte: lastWeekDate } }),
            Venue.countDocuments({ createdAt: { $gte: lastWeekDate } }),
            Artist.countDocuments({ createdAt: { $gte: lastWeekDate } })
        ]);

        // Calculate growth percentages
        const calculateGrowth = (total, recent) => {
            if (total === 0) return 0;
            return ((recent / total) * 100).toFixed(2);
        };

        // Get ticket statistics
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfYear = new Date(today.getFullYear(), 0, 1);

        const [
            totalTickets,
            todayTickets,
            monthlyTickets,
            yearlyTickets
        ] = await Promise.all([
            Ticket.countDocuments({ bookingStatus: "confirmed" }),
            Ticket.countDocuments({
                bookingStatus: "confirmed",
                createdAt: { $gte: startOfDay }
            }),
            Ticket.countDocuments({
                bookingStatus: "confirmed",
                createdAt: { $gte: startOfMonth }
            }),
            Ticket.countDocuments({
                bookingStatus: "confirmed",
                createdAt: { $gte: startOfYear }
            })
        ]);

        // Get age group distribution
        const ageGroupPipeline = [
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $group: {
                    _id: {
                        $switch: {
                            branches: [
                                { case: { $lt: ["$user.age", 18] }, then: "under_18" },
                                { case: { $lt: ["$user.age", 25] }, then: "18_24" },
                                { case: { $lt: ["$user.age", 35] }, then: "25_34" },
                                { case: { $lt: ["$user.age", 50] }, then: "35_49" }
                            ],
                            default: "50_plus"
                        }
                    },
                    count: { $sum: 1 }
                }
            }
        ];

        const ageGroupDistribution = await Ticket.aggregate(ageGroupPipeline);

        // Calculate monthly trend
        const monthlyTrendPipeline = [
            {
                $match: {
                    bookingStatus: "confirmed",
                    createdAt: { $gte: new Date(today.getFullYear(), 0, 1) }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ];

        const monthlyTrend = await Ticket.aggregate(monthlyTrendPipeline);

        const stats = {
            totalCounts: {
                users: userCount,
                venues: venueCount,
                artists: artistCount,
                total: userCount + venueCount + artistCount
            },
            recentCounts: {
                newUsers: recentUsers,
                newVenues: recentVenues,
                newArtists: recentArtists,
                totalNew: recentUsers + recentVenues + recentArtists
            },
            growth: {
                userGrowth: calculateGrowth(userCount, recentUsers),
                venueGrowth: calculateGrowth(venueCount, recentVenues),
                artistGrowth: calculateGrowth(artistCount, recentArtists)
            },
            ticketStats: {
                total: totalTickets,
                today: todayTickets,
                thisMonth: monthlyTickets,
                thisYear: yearlyTickets,
                ageDistribution: ageGroupDistribution.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {}),
                monthlyTrend: monthlyTrend.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {})
            }
        };

        return res.status(200).json(
            new ApiResponse(
                200,
                stats,
                "Dashboard statistics fetched successfully"
            )
        );

    } catch (error) {
        throw new ApiError(500, "Error fetching dashboard statistics: " + error.message);
    }
});

export { getDashboardStats };