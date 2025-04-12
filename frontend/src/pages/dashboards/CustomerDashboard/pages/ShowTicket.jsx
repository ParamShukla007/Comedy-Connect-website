import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  Share2,
  QrCode,
  Ticket as TicketIcon,
} from "lucide-react";
import QRCodeViewer from "@/components/QRCodeViewer";

const mockTickets = [
  {
    id: "T123",
    eventName: "Comedy Night Special",
    artist: "Johnny D",
    venue: "Laugh Factory Mumbai",
    date: "2024-03-15",
    time: "19:00",
    ticketType: "VIP",
    seatNumber: "A12",
    price: "₹2000",
    status: "upcoming", // upcoming, completed, cancelled
    image: "https://source.unsplash.com/random/800x600/?comedy,event",
    qrCode: "data:image/png;base64,...", // Replace with actual QR code
  },
  {
    id: "T124",
    eventName: "Stand-up Spectacular",
    artist: "Sarah Smith",
    venue: "Comedy House Delhi",
    date: "2024-03-20",
    time: "20:00",
    ticketType: "General",
    seatNumber: "B15",
    price: "₹1500",
    status: "upcoming",
    image: "https://source.unsplash.com/random/800x600/?standup,comedy",
  },
  // Add more mock tickets...
];

const TicketCard = ({ ticket }) => {
  const [showQR, setShowQR] = useState(false);
  const isUpcoming = ticket.status === "upcoming";
  const eventDate = new Date(ticket.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all">
        <div className="relative">
          {/* Status Badge */}
          <Badge
            className={`absolute top-4 right-4 z-10 ${
              ticket.status === "upcoming"
                ? "bg-primary"
                : ticket.status === "completed"
                ? "bg-muted"
                : "bg-destructive"
            }`}
          >
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
          </Badge>

          {/* Event Image */}
          <div className="relative h-48">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <img
              src={ticket.image}
              alt={ticket.eventName}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 z-20 text-white">
              <h3 className="text-xl font-bold">{ticket.eventName}</h3>
              <p className="text-sm opacity-90">{ticket.artist}</p>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p className="font-medium">
                    {eventDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <p className="font-medium">{ticket.time}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Venue</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="font-medium">{ticket.venue}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Ticket Info</p>
                <div className="flex items-center gap-4 mt-1">
                  <Badge variant="outline" className="font-medium">
                    <TicketIcon className="h-3 w-3 mr-1" />
                    {ticket.ticketType}
                  </Badge>
                  <Badge variant="outline" className="font-medium">
                    Seat {ticket.seatNumber}
                  </Badge>
                </div>
              </div>
              <p className="text-xl font-bold text-primary">{ticket.price}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                className="flex-1"
                variant={isUpcoming ? "default" : "secondary"}
                onClick={() => setShowQR(true)}
              >
                <QrCode className="h-4 w-4 mr-2" />
                View Ticket
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowQR(true)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* QR Code Viewer */}
            <QRCodeViewer
              isOpen={showQR}
              onClose={() => setShowQR(false)}
              ticketData={ticket}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const ShowTicket = () => {
  const upcomingTickets = mockTickets.filter(
    (ticket) => ticket.status === "upcoming"
  );
  const pastTickets = mockTickets.filter(
    (ticket) => ticket.status !== "upcoming"
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold">My Tickets</h2>
        <p className="text-muted-foreground">Manage your event tickets</p>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Events
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {upcomingTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>

      {/* Past Events */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Past Events
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {pastTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowTicket;
