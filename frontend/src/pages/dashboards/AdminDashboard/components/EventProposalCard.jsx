import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, MapPin, Clock, DollarSign } from "lucide-react";

const EventProposalCard = ({ proposal, onViewDetails }) => (
  <Card className="p-6 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-4">
        <div className="flex justify-between">
          <div>
            <h3 className="text-xl font-semibold">{proposal.title}</h3>
            <p className="text-muted-foreground">{proposal.venueId.name}</p>
          </div>
          <Badge variant={proposal.isApproved ? "success" : "secondary"} className='h-8 mt-1'>
            {proposal.status}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-primary" />
            <span>{new Date(proposal.eventDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{proposal.startTime} - {proposal.endTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{proposal.venueId.address.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <span>₹{proposal.proposedPrice}</span>
          </div>
        </div>
      </div>
      <Button onClick={() => onViewDetails(proposal)} className="flex-1 max-w-80 rounded gap-2">
        View Details
      </Button>
    </div>
  </Card>
);

export default EventProposalCard;
