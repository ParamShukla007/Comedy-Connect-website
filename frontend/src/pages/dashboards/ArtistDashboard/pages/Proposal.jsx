import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, Banknote, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProposalCard = ({ proposal }) => (
  <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{proposal.title}</h3>
          <p className="text-muted-foreground">{proposal.venue}</p>
        </div>
        <Badge
          variant={
            proposal.status === "Approved"
              ? "default"
              : proposal.status === "Pending"
              ? "outline"
              : "destructive"
          }
        >
          {proposal.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{proposal.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span>{proposal.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{proposal.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span>{proposal.capacity} seats</span>
        </div>
        <div className="flex items-center gap-2">
          <Banknote className="h-4 w-4 text-primary" />
          <span>₹{proposal.ticketPrice}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-primary/10">
        <Button variant="outline" className="flex-1">
          View Details
        </Button>
        {proposal.status === "Pending" && (
          <Button variant="destructive" className="flex-1">
            Cancel
          </Button>
        )}
      </div>
    </div>
  </Card>
);

const AddShow = () => {
  const proposals = [
    {
      id: 1,
      title: "Weekend Comedy Special",
      venue: "Laugh Factory Mumbai",
      status: "Pending",
      date: "15 Mar 2024",
      time: "8:00 PM",
      location: "Andheri West",
      capacity: 200,
      ticketPrice: "499",
    },
    // Add more mock data
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">My Proposals</h2>
            <p className="text-muted-foreground">Manage your event proposals</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="grid md:grid-cols-2 gap-6">
            {proposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default AddShow;
