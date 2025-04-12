import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import ImageGallery from "./ImageGallery";

const EventDetailsModal = ({ event, onApprove }) => (
  <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">{event.title}</h3>
      <p className="text-muted-foreground">{event.description}</p>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold mb-2">Event Details</h4>
        <div className="space-y-2">
          <p>Type: {event.eventType}</p>
          <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
          <p>Time: {event.startTime} - {event.endTime}</p>
          <p>Min Age: {event.minAge}+</p>
          <p>Price: ₹{event.proposedPrice}</p>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Venue Details</h4>
        <div className="space-y-2">
          <p>{event.venueId.name}</p>
          <p>{event.venueId.address.street}</p>
          <p>{event.venueId.address.city}, {event.venueId.address.state}</p>
          <p>{event.venueId.address.pincode}</p>
        </div>
      </div>
    </div>

    <div>
      <h4 className="font-semibold mb-2">Media</h4>
      {event.mediaAssets.galleryImages && (
        <ImageGallery images={event.mediaAssets.galleryImages} />
      )}
    </div>

    <div>
      <h4 className="font-semibold mb-2">Tags & Genres</h4>
      <div className="flex flex-wrap gap-2">
        {event.genres.map((genre, index) => (
          <Badge key={index} variant="secondary">{genre}</Badge>
        ))}
        {event.tags.map((tag, index) => (
          <Badge key={index} variant="outline">{tag}</Badge>
        ))}
      </div>
    </div>

    <div className="flex gap-4 sticky bottom-0 bg-background py-4">
      <Button onClick={() => onApprove(event._id)} className="flex-1">
        <ThumbsUp className="mr-2 h-4 w-4" />
        Approve Event
      </Button>
      <Button variant="outline" className="flex-1">
        <ThumbsDown className="mr-2 h-4 w-4" />
        Reject
      </Button>
    </div>
  </div>
);

export default EventDetailsModal;
