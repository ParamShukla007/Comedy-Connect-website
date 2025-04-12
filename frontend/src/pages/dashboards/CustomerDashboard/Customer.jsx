import React from "react";
import Sidebar from "../components/Sidebar";
import CustomerDashboard from "./pages/CustomerDashboard";
import Ticket from "./pages/ViewBookings";
import Following from "./pages/Following";
import Profile from "./pages/Profile";
import { Route, Routes } from "react-router-dom";
import Events from "./pages/Events";
import Booking from "./pages/Booking";
import Wishlist from "./pages/Wishlist";

const Customer = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar with higher z-index */}
      <div className="fixed left-0 top-0 h-screen z-50 bg-background">
        <Sidebar />
      </div>

      {/* Main content with overflow handling */}
      <div className="flex-1 ml-64 min-h-screen overflow-x-hidden">
        <div className="w-full">
          <Routes>
            <Route path="/" element={<CustomerDashboard />} />
            <Route path="events" element={<Events />} />
            <Route path="booking/:id" element={<Booking />} />
            <Route path="tickets" element={<Ticket />} />
            <Route path="following" element={<Following />} />
            <Route path="profile" element={<Profile />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Customer;
