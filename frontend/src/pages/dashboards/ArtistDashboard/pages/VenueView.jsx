import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label"; // Add this
import {
  Search,
  MapPin,
  Users,
  Star,
  Calendar,
  Filter, // Add this
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import axios from "axios";
import { getAllVenues } from "@/api/venue.api";

const VenueCard = ({ venue }) => {
  const navigate = useNavigate();

  const handleBookClick = () => {
    navigate("/artist/booking", {
      state: {
        venueData: {
          id: venue._id,
          name: venue.name,
          location: `${venue.address?.city}, ${venue.address?.state}`,
          type: venue.venueTypes?.[0]?.name || "Venue",
          capacity: venue.capacity,
          rating: venue.rating,
          shows: venue.shows,
          image: venue.images?.[0] || "https://source.unsplash.com/random/800x600/?venue",
          description: venue.description,
          price: venue.basePrice || "Price on request",
          amenities: venue.amenities,
        },
      },
    });
  };

  return (
    <Card className="overflow-hidden bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all">
      <div className="h-48 bg-primary/10 relative">
        <img
          src={venue.images?.[0] || "https://source.unsplash.com/random/800x600/?venue"}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 right-2">{venue.venueTypes?.[0]?.name || "Venue"}</Badge>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{venue.name}</h3>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{venue.address?.city}, {venue.address?.state}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-primary" />
            <span>{venue.capacity}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-primary" />
            <span>{venue.Reviews?.length || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{venue?.shows || 0}+ shows</span>
          </div>
        </div>

        <Button className="w-full" onClick={handleBookClick}>
          Book Venue
        </Button>
      </div>
    </Card>
  );
};

const FilterSection = ({ filters, setFilters }) => {
  const handleValueChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters (
          {Object.values(filters).filter((v) => v !== "all" && v !== 0).length})
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] bg-background">
        <SheetHeader>
          <SheetTitle>Filter Venues</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-4">
          {/* Venue Type Filter */}
          <div className="space-y-2">
            <Label>Venue Type</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => handleValueChange("type", value)}
            >
              <SelectTrigger className="w-full bg-background border">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Comedy Club">Comedy Club</SelectItem>
                <SelectItem value="Theater">Theater</SelectItem>
                <SelectItem value="Lounge">Lounge</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Capacity Filter */}
          <div className="space-y-2">
            <Label>Minimum Capacity</Label>
            <div className="pt-2">
              <Slider
                defaultValue={[filters.minCapacity]}
                max={500}
                step={50}
                onValueChange={([value]) =>
                  handleValueChange("minCapacity", value)
                }
                className="w-full bg-white dark:bg-gray-950"
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">0</span>
                <span className="text-sm font-medium">
                  {filters.minCapacity}+ seats
                </span>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <Label>Minimum Rating</Label>
            <Select
              value={filters.rating.toString()}
              onValueChange={(value) =>
                handleValueChange("rating", parseFloat(value))
              }
            >
              <SelectTrigger className="w-full bg-background border">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="0">Any Rating</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            variant="outline"
            onClick={() =>
              setFilters({
                type: "all",
                minCapacity: 0,
                maxPrice: 50000,
                rating: 0,
              })
            }
          >
            Reset Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Venue = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    minCapacity: 0,
    maxPrice: 50000,
    rating: 0,
  });
  const [venues, setVenues] = useState([]); // New state for venues
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  // Fetch venues from backend
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(getAllVenues, {headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}});
        if (response.data.success) {
          console.log(response)
          setVenues(response.data.venues);
          setFilteredVenues(response.data.venues);
        }
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Apply filters whenever search or filters change
  useEffect(() => {
    const filtered = venues.filter((venue) => {
      // Search filter
      const searchMatch =
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${venue.address?.city}, ${venue.address?.state}`.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter
      const typeMatch = filters.type === "all" || venue.venueTypes?.some(type => type.name === filters.type);

      // Capacity filter
      const capacityMatch = parseInt(venue.capacity) >= filters.minCapacity;

      // Rating filter
      const ratingMatch = (venue.Reviews?.length || 0) >= filters.rating;

      return searchMatch && typeMatch && capacityMatch && ratingMatch;
    });

    setFilteredVenues(filtered);
  }, [searchQuery, filters, venues]);

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Browse Venues</h2>
          <p className="text-muted-foreground">
            Find the perfect venue for your next show
          </p>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-950"
            />
          </div>
          <FilterSection filters={filters} setFilters={setFilters} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading venues...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.length > 0 ? (
              filteredVenues.map((venue) => (
                <motion.div
                  key={venue._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <VenueCard venue={venue} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  No venues match your filters
                </p>
                <Button
                  variant="link"
                  onClick={() =>
                    setFilters({
                      type: "all",
                      minCapacity: 0,
                      maxPrice: 50000,
                      rating: 0,
                    })
                  }
                  className="mt-2"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Venue;
