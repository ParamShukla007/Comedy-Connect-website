import React from 'react';
import Slider from 'react-slick';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const EventCarousel = ({ events }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    autoplay: true
  };

  return (
    <div className="py-8 bg-gradient-to-r from-primary/20 to-primary/10">
      <div className="max-w-6xl mx-auto px-4">
        <Slider {...settings} className="venue-carousel">
          {events.map((event) => (
            <div key={event.id} className="relative h-96 rounded-xl overflow-hidden">
              <img 
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">{event.title}</h2>
                  <p className="text-sm text-white">{event.location} • {event.date}</p>
                </div>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-2">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default EventCarousel;
