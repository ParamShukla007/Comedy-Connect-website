import React from "react";
import Sidebar from "../components/Sidebar";
import VenueDashboard from "./pages/VenueDashboard";
import Manage from "./pages/ManageVenue";
import Proposal from "./pages/AddVenue";
import Analystics from "./pages/Analystics";
import Profile from "./pages/Profile";
import { Routes,Route } from "react-router-dom";
const VenueManager = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <Routes>
        <Route path="/" element={<VenueDashboard />} />
        <Route path="manage" element={<Manage />} />
        <Route path="proposals" element={<Proposal />} />
        <Route path="analystics" element={<Analystics />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
      
    </div>
  );
};

export default VenueManager;
