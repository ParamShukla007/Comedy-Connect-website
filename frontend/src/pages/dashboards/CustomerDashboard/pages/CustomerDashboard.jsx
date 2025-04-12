import React, { useState, useEffect } from "react";
import SearchBar from "@/components/dashboard/SearchBar";
import EventCarousel from "@/components/dashboard/EventCarousel";
import FeaturedEvents from "@/components/dashboard/FeaturedEvents";
import GenresSection from "@/components/dashboard/GenresSection";
import NearYou from "@/components/dashboard/NearYou";
import SearchResults from "@/components/dashboard/SearchResults";
import Youtube from "@/pages/landing/Youtube";
import Shorts from "@/pages/landing/Shorts";
// Import asset images
import img_big from "../../../../assets/img_big.webp";
import img_big2 from "../../../../assets/img_big2.jpg";
import img_big3 from "../../../../assets/img_big3.jpg";

// Updated sample data with proper ISO date strings and a new 'genre' key.
const sampleCarouselEvents = [
  {
    id: 1,
    title: "Comedy Night Live",
    location: "Mumbai",
    date: "2023-10-25T00:00:00",
    genre: "Satire",
    image: img_big,
  },
  {
    id: 2,
    title: "Stand-up Premier League",
    location: "Delhi",
    date: "2023-10-28T00:00:00",
    genre: "Observational Comedy",
    image: img_big2,
  },
  {
    id: 3,
    title: "Laugh Riot Festival",
    location: "Bangalore",
    date: "2023-11-02T00:00:00",
    genre: "Improvisational",
    image: img_big3,
  },
];
const sampleFeaturedEvents = [
  {
    id: 1,
    title: "Satire Special",
    comedian: "Vir Das",
    price: "₹499",
    date: "2023-10-25T00:00:00",
    venue: "Comedy Cube",
    genre: "Satire",
    image: img_big,
  },
  {
    id: 2,
    title: "Roast Battle",
    comedian: "Kaneez Surka",
    price: "₹699",
    date: "2023-10-28T00:00:00",
    venue: "Laugh Factory",
    genre: "Roast Battles",
    image: img_big2,
  },
  {
    id: 3,
    title: "Improv Jam",
    comedian: "Kenny Sebastian",
    price: "₹399",
    date: "2023-11-02T00:00:00",
    venue: "Funny Bone",
    genre: "Improvisational",
    image: img_big3,
  },
];
const sampleNearYouEvents = [
  {
    id: 1,
    title: "Local Laughs",
    location: "Mumbai",
    date: "2023-10-26T00:00:00",
    price: "₹299",
    genre: "Sketch Comedy",
    image: img_big,
  },
  {
    id: 2,
    title: "Neighborhood Giggle",
    location: "Pune",
    date: "2023-10-27T00:00:00",
    price: "₹399",
    genre: "Musical Comedy",
    image: img_big2,
  },
  {
    id: 3,
    title: "Hometown Humor",
    location: "Bangalore",
    date: "2023-10-28T00:00:00",
    price: "₹499",
    genre: "Dark Comedy",
    image: img_big3,
  },
];
const genres = [
  "Observational Comedy",
  "Satire",
  "Improvisational",
  "Sketch Comedy",
  "Dark Comedy",
  "Musical Comedy",
  "Roast Battles",
  "Character Comedy",
];

const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce input (poll every 500ms)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filtering: now using updated fields.
  // (For advanced date filtering, consider using Date.parse and comparing with current date.)
  const allEvents = [...sampleFeaturedEvents, ...sampleNearYouEvents];
  const filteredResults = allEvents.filter((e) => {
    const query = debouncedQuery.toLowerCase();
    return (
      (e.title && e.title.toLowerCase().includes(query)) ||
      (e.comedian && e.comedian.toLowerCase().includes(query)) ||
      (e.location && e.location.toLowerCase().includes(query)) ||
      (e.genre && e.genre.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <SearchBar onSearch={setSearchQuery} />
      {debouncedQuery.trim() !== "" ? (
        <SearchResults events={filteredResults} />
      ) : (
        <>
          <EventCarousel events={sampleCarouselEvents} />
          <FeaturedEvents events={sampleFeaturedEvents} />
          <GenresSection genres={genres} />
          <NearYou events={sampleNearYouEvents} />

          {/* Video Content Section */}
          <div className="mt-20 space-y-20">
            {/* Youtube Section */}
            <div className="w-full">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Featured Videos
              </h2>
              <Youtube />
            </div>

            {/* Shorts Section */}
            <div className="w-full">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Trending Shorts
              </h2>
              <Shorts />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerDashboard;
