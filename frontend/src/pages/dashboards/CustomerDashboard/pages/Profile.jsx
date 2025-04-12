import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Mail, Phone, Edit, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EditProfileModal from "../components/EditProfileModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const API_BASE_URL = "http://localhost:8000/api/v1";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Please login to continue");
        navigate("/signin");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/users/current-user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true
      });

      if (response.data?.success) {
        setUserData(response.data.data);
        setError(null);
      } else {
        throw new Error(response.data?.message || "Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      const errorMessage = error.response?.data?.message || "Error fetching profile data";
      setError(errorMessage);
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        navigate("/signin");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUpdateProfile = async (updatedData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        toast.error("Please login to continue");
        navigate("/signin");
        return;
      }

      const response = await axios.patch(
        `${API_BASE_URL}/users/update-account`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );

      if (response.data?.success) {
        setUserData(response.data.data);
        toast.success("Profile updated successfully!");
        setIsEditProfileOpen(false);
      } else {
        throw new Error(response.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Error updating profile");

      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        navigate("/signin");
      }
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchUserData} />;
  if (!userData) return <NoDataState onSignIn={() => navigate("/signin")} />;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={userData.profile_image || "/default-avatar.png"}
                  alt={userData.fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/10"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {userData.fullName}
                  </h1>
                  <p className="text-muted-foreground">@{userData.username}</p>
                </div>

                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{userData.email}</span>
                  </div>
                  {userData.phone_no && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{userData.phone_no}</span>
                    </div>
                  )}
                  {userData.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{userData.address}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 text-sm">
                  {userData.age && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Age: {userData.age}</span>
                    </div>
                  )}
                  {userData.gender && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-primary" />
                      <span>Gender: {userData.gender}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsEditProfileOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </Card>
      </div>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        userData={userData}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
};

// Separate components for different states
const LoadingState = () => (
  <div className="min-h-screen bg-background p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="space-y-4 flex-1">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-4 w-60" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </Card>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen bg-background p-6 flex items-center justify-center">
    <Card className="p-6 max-w-md w-full">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-destructive">Error Loading Profile</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={onRetry}>Try Again</Button>
      </div>
    </Card>
  </div>
);

const NoDataState = ({ onSignIn }) => (
  <div className="min-h-screen bg-background p-6 flex items-center justify-center">
    <Card className="p-6 max-w-md w-full">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">No Profile Data</h2>
        <p className="text-muted-foreground">Unable to load profile information</p>
        <Button onClick={onSignIn}>Sign In Again</Button>
      </div>
    </Card>
  </div>
);

export default Profile;