import React, { useState } from 'react';
import { toast } from "sonner";
import ManagerHeader from '../components/ManagerHeader';
import QuickStats from '../components/QuickStats';
import VenueCard from '../components/VenueCard';
import EditProfileModal from '../components/EditProfileModal';
import ManageVenueModal from '../components/ManageVenueModal';

const VenueManagerDashboard = () => {
  const [managerData, setManagerData] = useState({
    name: 'John Smith',
    email: 'john@comedyclub.com',
    monthlyRevenue: 156000,
    profileImage: '/api/placeholder/400/400'
  });

  const [venues, setVenues] = useState([
    {
      id: 1,
      name: 'The Comedy Cellar',
      capacity: 500,
      features: ['Professional Sound System', 'Stage Lighting', 'Green Room', 'Bar Service'],
      monthlyRevenue: 45000,
      images: ['/api/placeholder/400/300'],
      upcomingEvents: 5,
      averageRating: 4.8,
      location: 'Downtown NYC'
    },
    {
      id: 2,
      name: 'Laugh Factory',
      capacity: 200,
      features: ['Premium Sound', 'VIP Section', 'Recording Equipment'],
      monthlyRevenue: 28000,
      images: ['/api/placeholder/400/300'],
      upcomingEvents: 3,
      averageRating: 4.6,
      location: 'West Village'
    },
  ]);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isManageVenueOpen, setIsManageVenueOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [imagePreview, setImagePreview] = useState(managerData.profileImage);

  const handleProfileUpdate = (newData) => {
    setManagerData(prev => ({ ...prev, ...newData }));
    toast.success('Profile Updated Successfully');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setManagerData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVenueUpdate = (venueData) => {
    setVenues(prev => 
      prev.map(venue => 
        venue.id === venueData.id ? { ...venue, ...venueData } : venue
      )
    );
    toast.success('Venue Updated Successfully');
  };

  const handleManageVenue = (venue) => {
    setSelectedVenue(venue);
    setIsManageVenueOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <ManagerHeader 
        managerData={managerData}
        onEditClick={() => setIsEditProfileOpen(true)}
      />

      <QuickStats venues={venues} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <VenueCard 
            key={venue.id} 
            venue={venue} 
            onManage={handleManageVenue}
          />
        ))}
      </div>

      <EditProfileModal 
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        managerData={managerData}
        onUpdate={handleProfileUpdate}
        imagePreview={imagePreview}
        onImageUpload={handleImageUpload}
      />

      <ManageVenueModal 
        isOpen={isManageVenueOpen}
        onClose={() => setIsManageVenueOpen(false)}
        venue={selectedVenue}
        onUpdate={handleVenueUpdate}
      />
    </div>
  );
};

export default VenueManagerDashboard;
