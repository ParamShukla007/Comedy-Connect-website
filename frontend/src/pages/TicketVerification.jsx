import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";

const TicketVerification = () => {
  const { ticketId } = useParams();

  // Here you would verify the ticket against your backend
  const verifyTicket = async (id) => {
    // Add your verification logic here
    return true; // Mock response
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-md mx-auto p-6 text-center">
        {verifyTicket(ticketId) ? (
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-green-500">Valid Ticket</h2>
            <p className="text-muted-foreground">Ticket ID: {ticketId}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <X className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-500">Invalid Ticket</h2>
            <p className="text-muted-foreground">This ticket is not valid</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TicketVerification;
