import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Filter,
  Search,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Star,
  Users,
  DollarSign,
  Calendar as CalendarIcon,
} from "lucide-react";

const ProposalCard = ({ proposal }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="flex items-start justify-between">
      <div className="flex gap-4">
        <img
          src={proposal.comedianImage}
          alt={proposal.comedianName}
          className="w-16 h-16 rounded-full object-cover border-2 border-primary"
        />
        <div>
          <h3 className="font-semibold text-lg">{proposal.comedianName}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{proposal.rating}</span>
            <span>•</span>
            <Users className="w-4 h-4" />
            <span>{proposal.followers} followers</span>
          </div>
        </div>
      </div>
      <Badge
        variant={proposal.status === "Pending" ? "outline" : "default"}
        className={`
          ${proposal.status === "Approved" && "bg-green-100 text-green-800"} 
          ${proposal.status === "Declined" && "bg-red-100 text-red-800"}
          ${proposal.status === "Pending" && "bg-yellow-100 text-yellow-800"}
        `}
      >
        {proposal.status}
      </Badge>
    </div>

    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2 text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>Proposed Date: {proposal.date}</span>
        <Clock className="w-4 h-4 ml-4" />
        <span>{proposal.time}</span>
      </div>

      <div className="flex items-center gap-2 text-gray-600">
        <DollarSign className="w-4 h-4" />
        <span>Expected Revenue: {proposal.expectedRevenue}</span>
      </div>

      <p className="text-gray-600">{proposal.description}</p>

      <div className="border-t pt-4 mt-4">
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button
            variant="default"
            className="flex-1 bg-green-500 hover:bg-green-600"
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            Accept
          </Button>
          <Button variant="destructive" className="flex-1">
            <ThumbsDown className="w-4 h-4 mr-2" />
            Decline
          </Button>
        </div>
      </div>
    </div>
  </div>
);

const ProposalPage = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Example data - replace with your actual data
  const proposals = [
    {
      id: 1,
      comedianName: "Alex Rivera",
      comedianImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      rating: 4.8,
      followers: "25.3K",
      status: "Pending",
      date: "Mar 15, 2024",
      time: "8:00 PM",
      expectedRevenue: "$2,500",
      description:
        "Stand-up comedy special featuring fresh material and audience interaction. Perfect for your venue's weekend lineup.",
    },
    {
      id: 2,
      comedianName: "Sarah Johnson",
      comedianImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      rating: 4.9,
      followers: "45K",
      status: "Approved",
      date: "Mar 20, 2024",
      time: "9:00 PM",
      expectedRevenue: "$3,200",
      description:
        "A hilarious night of comedy featuring my latest tour material. Known for selling out venues across the country.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Show Proposals</h1>
          <p className="mt-2 text-primary-foreground/90">
            Manage and review upcoming show proposals
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              onClick={() => setFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={filter === "approved" ? "default" : "outline"}
              onClick={() => setFilter("approved")}
            >
              Approved
            </Button>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search proposals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Proposals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProposalPage;
