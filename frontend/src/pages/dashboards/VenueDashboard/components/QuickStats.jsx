import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Star, Ticket } from "lucide-react";

const QuickStats = ({ venues }) => {
  const totalUpcomingShows = venues.reduce((acc, venue) => acc + venue.upcomingEvents, 0);
  const averageRating = (venues.reduce((acc, venue) => acc + venue.averageRating, 0) / venues.length).toFixed(1);
  const totalCapacity = venues.reduce((acc, venue) => acc + venue.capacity, 0);

  const stats = [
    { icon: Calendar, label: "Upcoming Shows", value: totalUpcomingShows },
    { icon: Star, label: "Average Rating", value: averageRating },
    { icon: Ticket, label: "Total Capacity", value: totalCapacity }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4 flex items-center gap-4">
            <stat.icon className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;
