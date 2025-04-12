import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getAllEvents } from "@/api/event.api";
import { getOneUser } from "@/api/user.api";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const NearYou = () => {
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPincode, setUserPincode] = useState(null);
  const navigate = useNavigate();

  const calculateProximity = (userPin, venuePin) => {
    if (!userPin || !venuePin) return Infinity;

    // Convert pincodes to numbers and get absolute difference
    const userPinNum = parseInt(userPin);
    const venuePinNum = parseInt(venuePin);
    return Math.abs(userPinNum - venuePinNum);
  };

  useEffect(() => {
    fetchUserAndEvents();
  }, []);

  const fetchUserAndEvents = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");

      if (!accessToken || !userId) {
        toast.error("Please login to see events near you");
        return;
      }

      // Debug user request
      console.log("Making user request with:", { userId, accessToken });

      const userResponse = await axios.post(
        getOneUser,
        { userId: userId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("User Response:", userResponse.data);

      if (userResponse.data.success) {
        const userPincode = userResponse.data.data.address?.pincode;
        console.log("User Pincode:", userPincode);
        setUserPincode(userPincode);

        if (!userPincode) {
          console.log("No pincode found in user data");
          return;
        }

        // Fetch and log all events
        console.log("Fetching all events...");
        const eventsResponse = await axios.get(getAllEvents, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        console.log("All Events Response:", eventsResponse.data);
        console.log("Total Events Fetched:", eventsResponse.data.data.length);

        if (eventsResponse.data.success) {
          const allEvents = eventsResponse.data.data;
          console.log("All Events:", allEvents);

          // Log each event's details
          allEvents.forEach((event, index) => {
            console.log(`Event ${index + 1}:`, {
              id: event._id,
              title: event.title,
              venue: event.venueId?.name,
              venuePincode: event.venueId?.address?.pincode,
              proximity: calculateProximity(
                userPincode,
                event.venueId?.address?.pincode
              ),
            });
          });

          const nearbyEvents = allEvents.filter((event) => {
            const venuePincode = event.venueId?.address?.pincode;
            const proximity = calculateProximity(userPincode, venuePincode);
            return proximity < 5;
          });

          console.log("Filtered Nearby Events:", nearbyEvents);
          console.log("Number of Nearby Events:", nearbyEvents.length);

          setNearbyEvents(nearbyEvents);
        }
      }
    } catch (error) {
      console.error("Error details:", error.response || error);
      toast.error(
        error.response?.data?.message || "Failed to fetch nearby events"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Near You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!userPincode) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Location Not Found</h2>
          <p className="text-muted-foreground mb-4">
            Please update your profile with your address to see events near you.
          </p>
          <Button onClick={() => navigate("/customer/profile")}>
            Update Profile
          </Button>
        </div>
      </div>
    );
  }

  if (nearbyEvents.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">No Events Nearby</h2>
          <p className="text-muted-foreground mb-4">
            We couldn't find any events near pincode {userPincode}.
          </p>
          <Button onClick={() => navigate("/customer/events")}>
            View All Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-foreground">
        Events Near You ({userPincode})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {nearbyEvents.map((event) => (
          <div
            key={event._id}
            className="glass-card rounded-xl overflow-hidden venue-card hover:shadow-lg"
          >
            <div className="relative">
              <img
                src={
                  event.mediaAssets?.bannerImageUrl ||
                  event.mediaAssets?.thumbnailUrl ||
                  "/default-event.jpg"
                }
                alt={event.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {event.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-white">
                      {event.venueId?.name} •{" "}
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-white">
                      Distance:{" "}
                      {calculateProximity(
                        userPincode,
                        event.venueId?.address?.pincode
                      )}{" "}
                      units
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => navigate(`/customer/booking/${event._id}`)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearYou;
