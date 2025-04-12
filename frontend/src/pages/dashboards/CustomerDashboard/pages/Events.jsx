import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "@/components/dashboard/SearchBar";
import EventCard from "@/components/dashboard/EventCard";
import { getAllEvents } from "@/api/event.api";
import { Loader2 } from "lucide-react";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(getAllEvents);
        setEvents(response.data.data);
        setFilteredEvents(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch events");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle search debouncing
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filter events based on search
  useEffect(() => {
    const query = debouncedQuery.toLowerCase();
    const filtered = events.filter(
      (e) =>
        (e.title && e.title.toLowerCase().includes(query)) ||
        (e.comedian && e.comedian.toLowerCase().includes(query)) ||
        (e.location && e.location.toLowerCase().includes(query)) ||
        (e.genre && e.genre.toLowerCase().includes(query))
    );
    setFilteredEvents(filtered);
  }, [debouncedQuery, events]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <SearchBar onSearch={setSearchQuery} />
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={index}
              className="w-full aspect-[3/4] glass-card rounded-xl overflow-hidden bg-card animate-pulse"
            >
              <div className="h-[60%] bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <SearchBar onSearch={setSearchQuery} />
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event._id || event.id} className="w-full aspect-[3/4]">
              <EventCard event={event} />
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-muted-foreground py-12">
            <p className="text-lg font-medium">No events found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
