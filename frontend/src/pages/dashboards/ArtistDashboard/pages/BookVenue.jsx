import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  MapPin,
  Users,
  Star,
  CalendarIcon,
  Clock,
  Info,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { createEvent } from "@/api/event.api";
import { toast } from "sonner";
import axios from "axios";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const timeSlots = [
  { value: "18:00", label: "6:00 PM" },
  { value: "18:30", label: "6:30 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "19:30", label: "7:30 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "20:30", label: "8:30 PM" },
  { value: "21:00", label: "9:00 PM" },
  { value: "21:30", label: "9:30 PM" },
];

const endTimeSlots = [
  { value: "19:00", label: "7:00 PM" },
  { value: "19:30", label: "7:30 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "20:30", label: "8:30 PM" },
  { value: "21:00", label: "9:00 PM" },
  { value: "21:30", label: "9:30 PM" },
  { value: "22:00", label: "10:00 PM" },
  { value: "22:30", label: "10:30 PM" },
  { value: "23:00", label: "11:00 PM" },
];

const eventTypes = [
  { value: "standup", label: "Stand-up Comedy" },
  { value: "improv", label: "Improv Show" },
  { value: "sketch", label: "Sketch Comedy" },
  { value: "open_mic", label: "Open Mic" },
  { value: "variety", label: "Variety Show" },
];

const BookVenue = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const venueData = location.state?.venueData;
  const [showMoreFields, setShowMoreFields] = useState(false);
  const [pricingType, setPricingType] = useState("fixed"); // 'fixed' or 'percentage'

  // Basic Fields
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: null,
    startTime: "",
    endTime: "",
    minAge: 18,
    proposedPrice: "",
    expectedAudience: "",
    additionalNotes: "",
    // Optional Fields
    eventType: "standup",
    genres: [],
    tags: [],
    mediaAssets: [],
    percentageCommission: "",
    venueId: "",
  });

  if (!venueData) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">No Venue Selected</h2>
            <p className="text-muted-foreground">
              Please select a venue from the venues page.
            </p>
            <Button onClick={() => navigate("/artist/venues")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Venues
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateEndTime = (startTime, duration) => {
    if (!startTime || !duration) return "";
    const [hours, minutes] = startTime.split(":");
    const durationHours = parseFloat(duration);
    const totalMinutes =
      parseInt(hours) * 60 + parseInt(minutes) + durationHours * 60;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        minAge: formData.minAge,
        genres: formData.genres.length
          ? formData.genres.split(",").map((g) => g.trim())
          : [],
        tags: formData.tags.length
          ? formData.tags.split(",").map((t) => t.trim())
          : [],
        mediaAssets: formData.mediaAssets.length
          ? formData.mediaAssets.split(",").map((m) => m.trim())
          : [],
        proposedPrice: formData.proposedPrice,
        percentageCommission: formData.percentageCommission || null,
        venueId: venueData.id,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      const response = await axios.post(createEvent, eventData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.data.success) {
        toast.success("Event created successfully!");
        navigate("/artist/events");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        // Time slot conflict error
        const conflictDetails = error.response.data.conflictDetails;
        toast.error(
          <div className="space-y-2">
            <p>Venue is already booked for this time slot</p>
            <div className="text-sm opacity-90">
              <p>Existing Event: {conflictDetails.existingEvent}</p>
              <p>Date: {new Date(conflictDetails.date).toLocaleDateString()}</p>
              <p>Time: {conflictDetails.time}</p>
            </div>
          </div>,
          {
            duration: 5000, // Show for 5 seconds
          }
        );
      } else {
        toast.error(
          "Error creating event: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  return (
    <div className="p-8">
      <Card className="p-6">
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/artist/venues")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">Book Venue: {venueData.name}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Venue Details */}
            <div className="space-y-6">
              {/* Venue Image and Basic Info */}
              <div className="relative h-48 rounded-lg overflow-hidden">
                <img
                  src={venueData.image}
                  alt={venueData.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2">
                  {venueData.type}
                </Badge>
              </div>

              {/* Venue Stats and Info */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-background rounded-lg">
                    <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="font-medium">{venueData.capacity}</p>
                    <p className="text-xs text-muted-foreground">Capacity</p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <Star className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="font-medium">{venueData.rating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="font-medium">{venueData.shows}+</p>
                    <p className="text-xs text-muted-foreground">Shows</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Location</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {venueData.location}
                  </p>
                </div>

                {venueData.amenities && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {venueData.amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium">Price</h4>
                  <p className="text-2xl font-bold text-primary">
                    {venueData.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div>
              <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6">
                    {/* Basic Event Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Event Details</h3>

                      <div className="space-y-4">
                        {/* Event Type */}
                        <div>
                          <Label>Event Type</Label>
                          <Select
                            value={formData.eventType}
                            onValueChange={(value) =>
                              handleInputChange("eventType", value)
                            }
                          >
                            <SelectTrigger className="bg-background border">
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border max-h-[200px]">
                              {eventTypes.map((type) => (
                                <SelectItem
                                  key={type.value}
                                  value={type.value}
                                  className="cursor-pointer hover:bg-muted"
                                >
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Event Title</Label>
                          <Input
                            required
                            value={formData.title}
                            onChange={(e) =>
                              handleInputChange("title", e.target.value)
                            }
                            placeholder="Enter event title"
                            className="bg-background border"
                          />
                        </div>

                        <div>
                          <Label>Description</Label>
                          <Textarea
                            required
                            value={formData.description}
                            onChange={(e) =>
                              handleInputChange("description", e.target.value)
                            }
                            placeholder="Describe your event..."
                            className="bg-background border min-h-[100px]"
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label>Show Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal bg-background border",
                                    !formData.eventDate &&
                                      "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {formData.eventDate
                                    ? format(formData.eventDate, "PPP")
                                    : "Select date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0 bg-background border"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={formData.eventDate}
                                  onSelect={(date) =>
                                    handleInputChange("eventDate", date)
                                  }
                                  initialFocus
                                  disabled={(date) => date < new Date()}
                                  className="bg-background rounded-md border"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div>
                            <Label>Start Time</Label>
                            <Select
                              value={formData.startTime}
                              onValueChange={(value) => {
                                handleInputChange("startTime", value);
                                // Calculate end time (2 hours after start time by default)
                                const [hours, minutes] = value.split(":");
                                const endHours = (parseInt(hours) + 2)
                                  .toString()
                                  .padStart(2, "0");
                                handleInputChange(
                                  "endTime",
                                  `${endHours}:${minutes}`
                                );
                              }}
                            >
                              <SelectTrigger className="bg-background border">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border max-h-[200px]">
                                {timeSlots.map((slot) => (
                                  <SelectItem
                                    key={slot.value}
                                    value={slot.value}
                                    className="cursor-pointer hover:bg-muted"
                                  >
                                    {slot.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label>Minimum Age</Label>
                            <Input
                              type="number"
                              required
                              value={formData.minAge}
                              onChange={(e) =>
                                handleInputChange("minAge", e.target.value)
                              }
                              className="bg-background border"
                              min="0"
                            />
                          </div>

                          <div>
                            <Label>End Time</Label>
                            <Select
                              value={formData.endTime}
                              onValueChange={(value) => handleInputChange("endTime", value)}
                            >
                              <SelectTrigger className="bg-background border">
                                <SelectValue placeholder="Select end time" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border max-h-[200px]">
                                {endTimeSlots
                                  .filter(slot => slot.value > formData.startTime) // Only show times after start time
                                  .map((slot) => (
                                    <SelectItem
                                      key={slot.value}
                                      value={slot.value}
                                      className="cursor-pointer hover:bg-muted"
                                    >
                                      {slot.label}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Optional Fields Toggle */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowMoreFields(!showMoreFields)}
                      className="w-full"
                    >
                      {showMoreFields ? (
                        <MinusCircle className="w-4 h-4 mr-2" />
                      ) : (
                        <PlusCircle className="w-4 h-4 mr-2" />
                      )}
                      {showMoreFields ? "Show Less Fields" : "Add More Fields"}
                    </Button>

                    {/* Optional Fields */}
                    {showMoreFields && (
                      <div className="space-y-4">
                        <div>
                          <Label>Genres (comma-separated)</Label>
                          <Input
                            value={formData.genres}
                            onChange={(e) =>
                              handleInputChange("genres", e.target.value)
                            }
                            placeholder="comedy, improv, sketch"
                            className="bg-background border"
                          />
                        </div>

                        <div>
                          <Label>Tags (comma-separated)</Label>
                          <Input
                            value={formData.tags}
                            onChange={(e) =>
                              handleInputChange("tags", e.target.value)
                            }
                            placeholder="funny, entertainment, family"
                            className="bg-background border"
                          />
                        </div>

                        <div>
                          <Label>Media Assets URLs (comma-separated)</Label>
                          <Input
                            value={formData.mediaAssets}
                            onChange={(e) =>
                              handleInputChange("mediaAssets", e.target.value)
                            }
                            placeholder="http://example.com/image1.jpg, http://example.com/image2.jpg"
                            className="bg-background border"
                          />
                        </div>
                      </div>
                    )}

                    {/* Pricing Section */}
                    <div className="space-y-4">
                      <Label>Pricing Type</Label>
                      <RadioGroup
                        value={pricingType}
                        onValueChange={(value) => {
                          setPricingType(value);
                          // Clear both fields when switching
                          handleInputChange("proposedPrice", "");
                          handleInputChange("percentageCommission", "");
                        }}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fixed" id="fixed" />
                          <Label htmlFor="fixed">Fixed Price</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="percentage" id="percentage" />
                          <Label htmlFor="percentage">
                            Percentage per Ticket
                          </Label>
                        </div>
                      </RadioGroup>

                      {pricingType === "fixed" ? (
                        <div>
                          <Label>Proposed Price (₹)</Label>
                          <Input
                            type="number"
                            required
                            value={formData.proposedPrice}
                            onChange={(e) =>
                              handleInputChange(
                                "proposedPrice",
                                e.target.value
                              )
                            }
                            className="bg-background border"
                            min="0"
                            placeholder="Enter fixed price"
                          />
                        </div>
                      ) : (
                        <div>
                          <Label>Percentage Commission per Ticket (%)</Label>
                          <Input
                            type="number"
                            required
                            value={formData.percentageCommission}
                            onChange={(e) =>
                              handleInputChange(
                                "percentageCommission",
                                e.target.value
                              )
                            }
                            className="bg-background border"
                            min="0"
                            max="100"
                            placeholder="Enter percentage"
                          />
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        !formData.title ||
                        !formData.description ||
                        !formData.eventDate ||
                        !formData.startTime ||
                        !formData.endTime ||
                        !formData.eventType ||
                        !(formData.proposedPrice ||
                          formData.percentageCommission)
                      }
                    >
                      Create Event
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookVenue;
