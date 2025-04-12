import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, MapPin, Check } from "lucide-react";
import Slider from "react-slick";
import { getAllVenues } from "@/api/venue.api";
import axios from "axios";

const VenueCarousel = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(getAllVenues, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.data.success) {
          setVenues(response.data.venues);
        }
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    vertical: true,
    verticalSwiping: true,
    adaptiveHeight: true,
  };

  if (loading) {
    return (
      <Card className="glass-card venue-carousel md:col-span-1">
        <CardHeader>
          <CardTitle>Your Venues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[250px]">
            Loading venues...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card venue-carousel md:col-span-1 bg-gradient-to-br from-background/80 to-background/50 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          Your Venues
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {venues.map((venue) => (
            <div
              key={venue._id}
              className="group relative overflow-hidden rounded-xl bg-black/5 hover:bg-black/10 transition-all duration-300 border border-border/50 hover:border-primary/50"
            >
              <div className="flex gap-4 p-4">
                {/* Venue Image */}
                <div className="relative w-40 h-40 overflow-hidden rounded-lg">
                  <img
                    src={venue.images[0]}
                    alt={venue.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Venue Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-semibold">{venue.name}</h3>
                      <Badge
                        variant={
                          venue.status === "approved_by_admin"
                            ? "success"
                            : "secondary"
                        }
                        className="flex items-center gap-1"
                      >
                        {venue.status === "approved_by_admin" && (
                          <Check className="w-3 h-3" />
                        )}
                        {venue.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" />
                      <p className="text-sm">
                        {`${venue.address.street}, ${venue.address.city}`}
                      </p>
                    </div>

                    {/* Capacity and Manager */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm">
                          Capacity: {venue.capacity}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Manager: {venue.managerId.email}
                      </span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {venue.amenities.map((amenity, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="bg-primary/10 hover:bg-primary/20 transition-colors"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VenueCarousel;
