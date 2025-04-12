import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Calendar, MapPin, Users, User, Clock, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getPendingEventsAdmin,
  getAllEvents,
  approveEventByAdmin,
  rejectEvent
} from "@/api/event.api";
import {
  registerVenue,
  approveVenue,
  verifyVenue,
  getAllVenues,
  getPendingVenues,
  rejectVenue
} from "@/api/venue.api";

const ManageProposal = () => {
  const [mainTab, setMainTab] = useState("events");
  const [eventTab, setEventTab] = useState("pending");
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [rejectedEvents, setRejectedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [pendingVenues, setPendingVenues] = useState([]);
  const [approvedVenues, setApprovedVenues] = useState([]);
  const [rejectedVenues, setRejectedVenues] = useState([]);

  // Fetch pending events on initial load
  useEffect(() => {
    fetchPendingEvents();
  }, []);

  // Fetch appropriate events when event tab changes
  useEffect(() => {
    switch (eventTab) {
      case "pending":
        fetchPendingEvents();
        break;
      case "approved":
        fetchApprovedEvents();
        break;
      case "rejected":
        fetchRejectedEvents();
        break;
      default:
        break;
    }
  }, [eventTab]);

  // Fetch appropriate venues when venue tab changes
  useEffect(() => {
    if (mainTab === "venues") {
      switch (eventTab) {
        case "pending":
          fetchPendingVenues();
          break;
        case "approved":
          fetchApprovedVenues();
          break;
        case "rejected":
          fetchRejectedVenues();
          break;
        default:
          break;
      }
    }
  }, [mainTab, eventTab]);

  const fetchPendingEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getPendingEventsAdmin, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      setPendingEvents(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch pending events");
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getAllEvents, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      const approved = response.data.data.filter(event => event.status !== "pending_approval");
      setApprovedEvents(approved);
    } catch (error) {
      toast.error("Failed to fetch approved events");
    } finally {
      setLoading(false);
    }
  };

  const fetchRejectedEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getAllEvents, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      const rejected = response.data.data.filter(event => event.status === "rejected");
      setRejectedEvents(rejected);
    } catch (error) {
      toast.error("Failed to fetch rejected events");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingVenues = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getPendingVenues, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      setPendingVenues(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch pending venues");
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedVenues = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getAllVenues, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      const approved = response.data.venues.filter(venue => venue.status === "approved_by_admin");
      setApprovedVenues(approved);
    } catch (error) {
      toast.error("Failed to fetch approved venues");
    } finally {
      setLoading(false);
    }
  };

  const fetchRejectedVenues = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getAllVenues, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      const rejected = response.data.venues.filter(venue => venue.status === "rejected");
      setRejectedVenues(rejected);
    } catch (error) {
      toast.error("Failed to fetch rejected venues");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    try {
      setLoading(true);
      await axios.post(approveEventByAdmin, 
        { eventId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }}
      );
      toast.success("Event approved successfully");
      fetchPendingEvents();
    } catch (error) {
      toast.error("Failed to approve event");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await axios.post(rejectEvent, 
        { 
          eventId: selectedEventId,
          rejectionReason 
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }}
      );
      toast.success("Event rejected successfully");
      setShowRejectDialog(false);
      setRejectionReason("");
      fetchPendingEvents();
    } catch (error) {
      toast.error("Failed to reject event");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVenue = async (venueId) => {
    try {
      setLoading(true);
      await axios.post(approveVenue, 
        { venueId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }}
      );
      toast.success("Venue approved successfully");
      fetchPendingVenues();
    } catch (error) {
      toast.error("Failed to approve venue");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectVenue = async () => {
    try {
      setLoading(true);
      await axios.post(rejectVenue, 
        { 
          venueId: selectedEventId, // Changed from eventId to venueId
          rejectionReason 
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }}
      );
      toast.success("Venue rejected successfully");
      setShowRejectDialog(false);
      setRejectionReason("");
      fetchPendingVenues(); // Changed from fetchPendingEvents to fetchPendingVenues
    } catch (error) {
      toast.error("Failed to reject venue");
    } finally {
      setLoading(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
      switch (status?.toLowerCase()) {
        case 'pending_approval':
          return 'bg-yellow-100 text-yellow-800';
        case 'approved_by_admin':
          return 'bg-green-100 text-green-800';
        case 'rejected':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
        {status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const EventTable = ({ events, showActions }) => (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Event</TableHead>
            <TableHead className="font-semibold">Artist</TableHead>
            <TableHead className="font-semibold">Date & Time</TableHead>
            <TableHead className="font-semibold">Venue</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            {showActions && <TableHead className="font-semibold">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event._id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  {event.primaryArtistId?.fullName}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {format(new Date(event.eventDate), "PPP")}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    {event.startTime} - {event.endTime}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {event.venueId?.name}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={event.status} />
              </TableCell>
              {showActions && (
                <TableCell className="space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleApprove(event._id)}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setSelectedEventId(event._id);
                      setShowRejectDialog(true);
                    }}
                    disabled={loading}
                  >
                    Reject
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
          {events.length === 0 && (
            <TableRow>
              <TableCell colSpan={showActions ? 6 : 5} className="text-center py-8 text-gray-500">
                No {eventTab} events found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  const VenueTable = ({ venues, showActions }) => (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Location</TableHead>
            <TableHead className="font-semibold">Capacity</TableHead>
            <TableHead className="font-semibold">Manager</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            {showActions && <TableHead className="font-semibold">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.map((venue) => (
            <TableRow key={venue._id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{venue.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {venue.address?.city}, {venue.address?.state}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  {venue.capacity}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  {venue.managerId?.name}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={venue.status} />
              </TableCell>
              {showActions && (
                <TableCell className="space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleApproveVenue(venue._id)}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setSelectedEventId(venue._id);
                      setShowRejectDialog(true);
                    }}
                    disabled={loading}
                  >
                    Reject
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
          {venues.length === 0 && (
            <TableRow>
              <TableCell colSpan={showActions ? 6 : 5} className="text-center py-8 text-gray-500">
                No {eventTab} venues found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Manage Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="events" value={mainTab} onValueChange={setMainTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="events">Event Proposals</TabsTrigger>
              <TabsTrigger value="venues">Venue Proposals</TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="space-y-6">
              <Tabs defaultValue="pending" value={eventTab} onValueChange={setEventTab}>
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                  ) : (
                    <EventTable events={pendingEvents} showActions={true} />
                  )}
                </TabsContent>

                <TabsContent value="approved" className="mt-6">
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                  ) : (
                    <EventTable events={approvedEvents} showActions={false} />
                  )}
                </TabsContent>

                <TabsContent value="rejected" className="mt-6">
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                  ) : (
                    <EventTable events={rejectedEvents} showActions={false} />
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="venues" className="space-y-6">
              <Tabs defaultValue="pending" value={eventTab} onValueChange={setEventTab}>
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                  ) : (
                    <VenueTable venues={pendingVenues} showActions={true} />
                  )}
                </TabsContent>

                <TabsContent value="approved" className="mt-6">
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                  ) : (
                    <VenueTable venues={approvedVenues} showActions={false} />
                  )}
                </TabsContent>

                <TabsContent value="rejected" className="mt-6">
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                  ) : (
                    <VenueTable venues={rejectedVenues} showActions={false} />
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Reject {mainTab === "events" ? "Event" : "Venue"}
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. This will be sent to the {mainTab === "events" ? "event organizer" : "venue manager"}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Rejection</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a detailed reason for rejection..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={mainTab === "events" ? handleReject : handleRejectVenue}
                disabled={!rejectionReason || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  'Confirm Rejection'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProposal;