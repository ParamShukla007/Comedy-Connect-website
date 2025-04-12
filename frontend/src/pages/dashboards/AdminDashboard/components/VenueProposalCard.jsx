import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";

const VenueProposalCard = ({ venue, onViewDetails }) => (
  <Card className="p-6 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-4">
        <div className="flex justify-between">
          <div>
            <h3 className="text-xl font-semibold">{venue.name}</h3>
            <p className="text-muted-foreground">{venue.ownerName}</p>
          </div>
          <Badge variant="secondary">Pending</Badge>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{venue.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span>Capacity: {venue.capacity}</span>
        </div>
      </div>
      <Button onClick={() => onViewDetails(venue)} className="flex-1 gap-2">
        View Details
      </Button>
    </div>
  </Card>
);

export default VenueProposalCard;
