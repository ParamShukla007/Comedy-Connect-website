import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "sonner";
import ManagerHeader from '../components/ManagerHeader';
import QuickStats from '../components/QuickStats';
import VenueCard from '../components/VenueCard';
import EditProfileModal from '../components/EditProfileModal';
import ManageVenueModal from '../components/ManageVenueModal';
import AWSHelper from '@/utils/awsHelper';

const VenueManagerDashboard = () => {
  const [managerData, setManagerData] = useState({
    fullName: '',
    email: '',
    phone_no: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      latitude: '',
      longitude: ''
    },
    profile_image: '/api/placeholder/400/400'
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
  const [imagePreview, setImagePreview] = useState(managerData.profile_image);

  const fetchManagerData = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/venuemanagers/current-user',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (!response.data?.data) {
        throw new Error('Invalid response data');
      }

      const userData = response.data.data;
      setManagerData({
        fullName: userData.fullName,
        email: userData.email,
        phone_no: userData.phone_no,
        address: userData.address || {
          street: '',
          city: '',
          state: '',
          pincode: '',
          latitude: '',
          longitude: ''
        },
        profile_image: userData.profile_image || '/api/placeholder/400/400'
      });
      setImagePreview(userData.profile_image || '/api/placeholder/400/400');
    } catch (error) {
      console.error('Error fetching manager data:', error);
      toast.error('Failed to load profile data');
    }
  };

  useEffect(() => {
    fetchManagerData();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // First upload to AWS
        const imageUrl = await AWSHelper.upload(
          file,
          managerData.fullName.replace(/\s+/g, '-').toLowerCase()
        );

        // Then update the profile with the AWS URL
        const response = await axios.patch(
          'http://localhost:8000/api/venuemanagers/update-details',
          { profile_image: imageUrl },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );

        setImagePreview(imageUrl);
        setManagerData(prev => ({ ...prev, profile_image: imageUrl }));
        toast.success('Profile image updated successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      }
    }
  };

  const handleProfileUpdate = async (newData) => {
    try {
      // Create update object with only fields that have values
      const updateData = {};
      
      if (newData.fullName?.trim()) updateData.fullName = newData.fullName;
      if (newData.email?.trim()) updateData.email = newData.email;
      if (newData.phone_no?.trim()) updateData.phone_no = newData.phone_no;
      
      // Only include address if at least one field has a value
      const addressFields = Object.entries(newData.address || {}).filter(([_, value]) => value?.trim());
      if (addressFields.length > 0) {
        updateData.address = Object.fromEntries(addressFields);
      }

      const response = await axios.patch(
        'http://localhost:8000/api/venuemanagers/update-details',
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      await fetchManagerData();
      toast.success('Profile Updated Successfully');
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
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