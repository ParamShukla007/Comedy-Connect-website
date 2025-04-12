import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FeaturedEvents = ({ events }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-foreground">Featured For You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="glass-card rounded-xl overflow-hidden venue-card hover:shadow-lg">
            <div className="relative">
              <img 
                src={event.image}
                alt={event.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">{event.title}</h3>
                  <p className="text-xs text-white">{event.comedian} • {event.date} • {event.venue}</p>
                </div>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-2">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedEvents;
