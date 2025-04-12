import React from "react";
import Sidebar from "../components/Sidebar";
import AdminDashboard from "./pages/AdminDashboard";
import Users from "./pages/Users";
import UserProfile from "./pages/UserProfile";
import Moderation from "./pages/Moderation";
import Analytics from "./pages/Analytics";
import { Routes, Route } from "react-router-dom";
import ManageProposal from "./pages/ManageProposal";
const Admin = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:userId" element={<UserProfile />} />
        <Route path="moderation" element={<Moderation />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="proposal" element={<ManageProposal />} />
      </Routes>
    </div>
  );
};

export default Admin;
