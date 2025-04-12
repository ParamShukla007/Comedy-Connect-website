import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, Users } from "lucide-react";

const VenueCard = ({ venue, onManage }) => {
  return (
    <Card className="overflow-hidden">
      <img 
        src={venue.images[0]} 
        alt={venue.name}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">{venue.name}</h3>
            <p className="text-muted-foreground">{venue.location}</p>
            <div className="flex items-center gap-2 mt-1">
              <Users className="h-4 w-4" />
              <span>{venue.capacity} seats</span>
              <Star className="h-4 w-4 ml-2" />
              <span>{venue.averageRating}</span>
            </div>
          </div>
          <p className="text-right">
            <span className="text-sm text-muted-foreground">Monthly</span>
            <br />
            <span className="font-semibold">${venue.monthlyRevenue.toLocaleString()}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {venue.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="secondary">{feature}</Badge>
          ))}
          {venue.features.length > 3 && (
            <Badge variant="secondary">+{venue.features.length - 3} more</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button className="w-full" variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            {venue.upcomingEvents} Shows
          </Button>
          <Button className="w-full" onClick={() => onManage(venue)}>
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VenueCard;
