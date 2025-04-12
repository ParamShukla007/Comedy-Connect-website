import React, { useEffect, useState } from 'react';
import StatsGrid from '../components/StatsGrid';
import RevenueCharts from '../components/RevenueCharts';
import PendingProposals from '../components/PendingProposals';
import VenueCarousel from '../components/VenueCarousel';
import UpcomingShows from '../components/UpcomingShows';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const VenueDashboard = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Initial theme check
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Theme change listener
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('dark')) {
          setTheme('dark');
        } else {
          setTheme('light');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Data objects (could be moved to a separate data file or API calls)
  const venues = [
    {
      name: 'Comedy Club Downtown',
      capacity: 200,
      upcoming: 3,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      address: '123 Main St, Downtown',
      amenities: ['Stage Lighting', 'Sound System', 'Green Room'],
      nextShow: '2024-02-15'
    },
    {
      name: 'Laugh Factory',
      capacity: 150,
      upcoming: 2,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1559519286-75tt922c0e40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      address: '456 Comedy Ave, Uptown',
      amenities: ['Premium Sound', 'Bar Service', 'VIP Area'],
      nextShow: '2024-02-20'
    }
  ];

  const upcomingShows = [
    {
      title: 'Comedy Night Special',
      date: '2024-02-15',
      time: '8:00 PM',
      comedian: {
        name: 'John Doe',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        rating: 4.9,
        followers: '12.5K'
      },
      venue: 'Comedy Club Downtown',
      tickets: {
        sold: 120,
        total: 200,
        price: '$25'
      },
      status: 'Confirmed'
    },
    // ...more shows
  ];

  const proposals = [
    {
      comedian: {
        name: 'Sarah Smith',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        rating: 4.7
      },
      show: 'Stand-up Saturday',
      date: '2024-03-01',
      venue: 'Laugh Factory',
      status: 'Pending',
      requestedOn: '2024-01-20'
    },
    // ...more proposals
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background to-background/80">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Venue Dashboard</h1>
        <button className="btn btn-primary">Add New Venue</button>
      </div>

      <StatsGrid />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RevenueCharts theme={theme} />
        <PendingProposals proposals={proposals} />
        <VenueCarousel venues={venues} />
        <UpcomingShows shows={upcomingShows} />
      </div>
    </div>
  );
};

export default VenueDashboard;
