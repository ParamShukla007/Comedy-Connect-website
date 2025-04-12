import React from "react";
import {
  ArrowRight,
  Image as ImageIcon,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/customer/booking/${event._id}`, { state: { event } });
  };

  return (
    <div
      className="relative w-full h-full glass-card rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-card flex flex-col"
      onClick={handleClick}
    >
      {/* Image Section - 60% height */}
      <div className="relative w-full h-[60%]">
        {event.mediaAssets?.thumbnailUrl ? (
          <img
            src={event.mediaAssets.thumbnailUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium 
            ${
              event.status === "approved"
                ? "bg-green-500"
                : event.status === "pending"
                ? "bg-yellow-500"
                : "bg-red-500"
            } 
            text-white backdrop-blur-sm`}
          >
            {event.status}
          </span>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      </div>

      {/* Content Section - 40% height */}
      <div className="relative flex flex-col justify-between p-4 h-[40%]">
        <div>
          <h3 className="text-lg font-bold mb-2 line-clamp-1">{event.title}</h3>
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">
                {new Date(event.eventDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">
                {event.startTime} - {event.endTime}
              </span>
            </div>
            {event.venueId && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 shrink-0" />
                <span className="truncate">
                  {event.venueId.name}, {event.venueId.address.city}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Price and CTA - Updated this section */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-lg font-semibold">₹{event.proposedPrice}</p>
            {event.primaryArtistId && (
              <p className="text-sm text-muted-foreground truncate">
                {event.primaryArtistId.fullName}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center overflow-visible">
              <ArrowRight className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
