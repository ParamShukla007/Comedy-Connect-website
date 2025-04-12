import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Tag, Ticket, DollarSign } from "lucide-react";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const ManageVenue = () => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProposals = async () => {
    try {
      const venueId = '67ba2ee1e9072bec73cbba16'; // Get venueId from localStorage
    const accessToken = localStorage.getItem('accessToken');

    if (!venueId || !accessToken) {
      throw new Error('Invalid venueId or accessToken');
    }

    // Changed to POST request
    const response = await axios.post(
      'http://localhost:8000/api/events/getPendingEventsVenueManager',
      { venueId }, // Request body
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

      console.log('API Response:', response.data);
      if (response.data?.success) {
        setProposals(response.data.data || []);
      } else {
        throw new Error('Failed to fetch proposals');
      }
    } catch (error) {
      console.error('Error fetching proposals:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to load event proposals');
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleApprove = async (eventId) => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      
      await axios.post(
        'http://localhost:8000/api/events/approveEventByVenueManager',
        { eventId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      toast.success('Event approved successfully');
      await fetchProposals();
    } catch (error) {
      console.error('Error approving event:', error);
      toast.error('Failed to approve event');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (eventId) => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      
      await axios.post(
        'http://localhost:8000/api/events/rejectEvent',
        { eventId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      
      toast.success('Event rejected');
      await fetchProposals();
    } catch (error) {
      console.error('Error rejecting event:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to reject event');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return time ? time.replace(/:/g, ':') : 'N/A';
  };

  return (
    <div className="p-6">
      <Tabs defaultValue="proposals">
        <TabsList>
          <TabsTrigger value="proposals">Pending Proposals</TabsTrigger>
          <TabsTrigger value="approved">Approved Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((event) => (
                <TableRow key={event._id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {event.primaryArtistId?.fullName || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{formatDate(event.eventDate)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{event.venueId?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.venueId?.address?.city}, {event.venueId?.address?.state}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="capitalize">{event.eventType}</p>
                      <p className="text-sm text-muted-foreground">
                        Age {event.minAge}+
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {event.percentageCommission ? `${event.percentageCommission}%` : 
                     event.proposedPrice ? `₹${event.proposedPrice}` : 'N/A'}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => handleApprove(event._id)}
                      disabled={isLoading}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleReject(event._id)}
                      disabled={isLoading}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {proposals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No pending proposals found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageVenue;
