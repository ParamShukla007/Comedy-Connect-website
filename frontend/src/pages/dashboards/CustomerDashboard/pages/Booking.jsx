import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getEventById } from "@/api/event.api";
import Razorpay from "../components/Razorpay";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Heart,
  Share2,
  ArrowLeft,
  Tags,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Threater from "./Threater";
import { createWishlist } from "@/api/whistlist.api";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode"; // Change this line
import BookingModal from "../components/BookingModal";

const Booking = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState(location.state?.event || null);
  const [loading, setLoading] = useState(!location.state?.event);
  const [error, setError] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${getEventById}/${id}`);
        setEvent(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch event details");
        setLoading(false);
      }
    };

    if (!location.state?.event) {
      fetchEventDetails();
    }
  }, [id, location.state]);

  const generateInvoice = (paymentId) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(20);
    doc.text("Comedy Club - Ticket Invoice", pageWidth / 2, 20, {
      align: "center",
    });

    // Add logo or branding if needed
    // doc.addImage(logoUrl, 'PNG', 20, 20, 40, 40);

    // Event Information
    doc.setFontSize(12);
    doc.text("Event Details", 20, 50);
    doc.setFontSize(10);
    doc.text(`${event.title}`, 20, 60);
    doc.text(`Date: ${new Date(event.eventDate).toLocaleDateString()}`, 20, 70);
    doc.text(`Time: ${event.startTime} - ${event.endTime}`, 20, 80);
    doc.text(`Venue: ${event.venue || "TBA"}`, 20, 90);

    // Payment Information
    doc.setFontSize(12);
    doc.text("Payment Details", 20, 110);
    doc.setFontSize(10);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 20, 120);
    doc.text(`Payment ID: ${paymentId}`, 20, 130);
    doc.text(`Order ID: ${Math.random().toString(36).substr(2, 9)}`, 20, 140);

    // Price Breakdown Table
    doc.autoTable({
      startY: 160,
      head: [["Description", "Amount"]],
      body: [
        ["Ticket Price", `₹${event.proposedPrice}`],
        ["Number of Tickets", ticketCount],
        ["Subtotal", `₹${event.proposedPrice * ticketCount}`],
        [
          "Discount",
          `₹${isPromoApplied ? event.proposedPrice * ticketCount * 0.05 : 0}`,
        ],
        ["Total Amount", `₹${calculateTotal()}`],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0] },
    });

    // Terms and conditions
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(8);
    doc.text("Terms & Conditions:", 20, finalY);
    doc.text("1. Please arrive 30 minutes before the show.", 20, finalY + 10);
    doc.text("2. This ticket is non-refundable.", 20, finalY + 15);
    doc.text(
      "3. Entry will not be permitted after the show starts.",
      20,
      finalY + 20
    );

    // Footer
    doc.setFontSize(10);
    doc.text(
      "Thank you for booking with Comedy Club!",
      pageWidth / 2,
      finalY + 40,
      {
        align: "center",
      }
    );

    // Save the PDF
    doc.save(`comedy-club-ticket-${paymentId}.pdf`);
  };

  const handlePayment = async (paymentDetails) => {
    try {
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");

      if (!userId || !accessToken) {
        toast.error("Please login to continue");
        navigate("/signin");
        return;
      }

      return await Razorpay({
        amount: paymentDetails.amount,
        userId,
        eventId: event._id,
        seats: paymentDetails.seats,
        ticketCount: paymentDetails.ticketCount,
        discount: paymentDetails.discount,
        promoCode: paymentDetails.promoCode,
        onSuccess: (paymentId) => {
          generateInvoice(paymentId);
          navigate("/customer/tickets");
        },
      });
    } catch (error) {
      console.error("Payment failed:", error);
      throw error;
    }
  };

  const handlePromoCode = () => {
    if (promoCode.trim()) {
      setIsPromoApplied(true);
      // You can add more complex promo code validation logic here
    }
  };

  const calculateTotal = () => {
    const subtotal = event.proposedPrice * ticketCount;
    const discount = isPromoApplied ? subtotal * 0.05 : 0; // 5% discount
    return subtotal - discount;
  };

  const getMapUrl = (venue) => {
    if (!venue) return "";
    const { address } = venue;
    const query = encodeURIComponent(
      `${address.street}, ${address.city}, ${address.state}, ${address.pincode}`
    );
    return `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  const renderVenueSection = () => {
    if (!event.venueId) return null;
    const { venueId } = event;

    return (
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold">Venue Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{venueId.name}</h3>
              <address className="text-muted-foreground not-italic">
                {venueId.address.street}
                <br />
                {venueId.address.city}, {venueId.address.state}
                <br />
                {venueId.address.pincode}
              </address>
            </div>

            {/* Additional venue information can be added here */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden h-[300px] shadow-lg">
            <iframe
              width="100%"
              height="100%"
              id="gmap_canvas"
              src={getMapUrl(event.venueId)}
              frameBorder="0"
              scrolling="no"
              title="Event Location Map"
              className="w-full"
            />
          </div>
        </div>
      </div>
    );
  };

  const handleAddToWishlist = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Please login to add to wishlist");
        navigate("/signin");
        return;
      }

      // Debug log to check values
      console.log("Request Details:", {
        endpoint: createWishlist,
        eventId: event._id,
        accessToken: accessToken,
      });
      const userId = localStorage.getItem("userId");
      // Make sure we're sending the right data structure
      const response = await axios({
        method: "post",
        url: createWishlist,
        data: {
          eventId: event._id,
          userId: userId, // Replace with actual user ID
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Full Response:", response); // Debug log

      if (response.data.success) {
        toast.success(
          response.data.message || "Added to wishlist successfully!"
        );
      } else {
        throw new Error(response.data.message || "Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Full error details:", {
        error: error,
        response: error.response,
        data: error.response?.data,
      });

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error adding to wishlist. Please try again."
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        navigate("/signin");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || "Event not found"}
      </div>
    );
  }

  const renderBookingSection = () => (
    <div className="glass-card rounded-xl p-6 space-y-6 sticky top-6">
      <h2 className="text-2xl font-bold">Book Tickets</h2>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          className="w-full"
          size="lg"
          onClick={() => setIsModalOpen(true)}
        >
          <Ticket className="mr-2 h-5 w-5" />
          Book Now
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleAddToWishlist}
        >
          <Heart className="mr-2 h-5 w-5" />
          Add to Wishlist
        </Button>
        <Button variant="outline" className="w-full">
          <Share2 className="mr-2 h-5 w-5" />
          Share Event
        </Button>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="relative h-[400px] rounded-xl overflow-hidden">
          <img
            src={
              event.mediaAssets?.bannerImageUrl ||
              event.mediaAssets?.thumbnailUrl
            }
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {event.title}
                </h1>
                {event.primaryArtistId && (
                  <p className="text-xl text-primary">
                    {event.primaryArtistId.fullName}
                  </p>
                )}
              </div>
              <div className="text-white text-right">
                <p className="text-3xl font-bold">₹{event.proposedPrice}</p>
                <p className="text-sm">per ticket</p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold">Event Details</h2>
              <p className="text-muted-foreground">{event.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>
                      {new Date(event.eventDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <User className="h-5 w-5 mr-2" />
                    <span>Min Age: {event.minAge}+</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Tags className="h-5 w-5 mr-2" />
                    <span>{event.eventType}</span>
                  </div>
                </div>
              </div>

              {/* Tags and Genres */}
              <div className="space-y-2">
                <h3 className="font-semibold">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {event.genres?.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Venue Section */}
            {renderVenueSection()}

            {/* Media Gallery */}
            {event.mediaAssets?.galleryImages?.length > 0 && (
              <div className="glass-card rounded-xl p-6 space-y-4">
                <h2 className="text-2xl font-bold">Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {event.mediaAssets.galleryImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Section */}
          <div className="space-y-6">{renderBookingSection()}</div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
