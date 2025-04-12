import React, { useState, useEffect } from "react";
import { getAllWishlists } from "@/api/whistlist.api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Ticket, Heart, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");

      if (!accessToken) {
        toast.error("Please login to view wishlist");
        navigate("/signin");
        return;
      }

      const response = await axios.post(
        getAllWishlists,
        {
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Raw API Response:", response.data);

      if (response.data.success && response.data.data) {
        const events = response.data.data.events || [];
        console.log("Events to render:", events);
        setWishlistItems(events);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen p-6">
        <Card className="max-w-md mx-auto text-center p-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Heart className="w-6 h-6" />
              Your Wishlist is Empty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Start adding events to your wishlist to see them here
            </p>
            <Button onClick={() => navigate("/customer/events")}>
              Browse Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Heart className="w-8 h-8 text-primary" />
          Your Wishlist ({wishlistItems.length})
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((event) => (
            <Card
              key={event._id}
              className="overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative h-48">
                <img
                  src={event.artist?.profileImage || "/default-event-image.jpg"}
                  alt={event.description}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl font-bold">
                    {event.artist?.stageName ||
                      event.artist?.name ||
                      "Unknown Artist"}
                  </h3>
                  {event.venue && (
                    <p className="text-white/80 text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.venue.name}
                      {event.venue.address && `, ${event.venue.address.city}`}
                    </p>
                  )}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>

                  {/* Venue Details */}
                  {event.venue && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {event.venue.address.street},{" "}
                          {event.venue.address.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>Capacity: {event.venue.capacity}</span>
                      </div>
                    </div>
                  )}

                  {/* Artist Info */}
                  {event.artist && Object.keys(event.artist).length > 0 && (
                    <div className="flex items-center gap-3 border-t pt-3">
                      <img
                        src={event.artist.profileImage || "/default-avatar.jpg"}
                        alt={event.artist.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{event.artist.stageName}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.artist.name}
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full mt-2"
                    onClick={() => navigate(`/customer/events/${event._id}`)}
                  >
                    View Event Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
