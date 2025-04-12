import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Share2,
} from "lucide-react";
import Posts from "./Posts";
import EditProfileModal from "./modals/EditProfileModal";
import AWSHelper from "@/utils/awsHelper";
import { toast } from "sonner";
import axios from "axios";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtistData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");

      if (!accessToken || !userId) {
        throw new Error("Missing access token or user ID");
      }

      // Changed to use axios.post with data in body instead of params
      const response = await axios({
        method: 'post',  // Change to POST
        url: "http://localhost:8000/api/artists/getOneArtist",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        data: {  // Send as request body instead of params
          artistId: userId
        }
      });

      console.log('Request config:', {
        artistId: userId,
        token: accessToken
      });

      if (response.data.success) {
        console.log('Artist data received:', response.data);
        setProfileData({
          _id: response.data.data._id,
          username: response.data.data.username,
          email: response.data.data.email,
          fullName: response.data.data.fullName,
          phoneNo: response.data.data.phone_no,
          age: response.data.data.age,
          address: response.data.data.address,
          gender: response.data.data.gender,
          stageName: response.data.data.stageName,
          bio: response.data.data.bio,
          yearsOfExperience: response.data.data.yearsExperience,
          genre: response.data.data.genre,
          profile_image: response.data.data.profile_image,
          socialLinks: response.data.data.socialLinks || {},
          followersCount: response.data.data.followersCount,
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch artist data");
      }
    } catch (error) {
      console.error("Error fetching artist data:", error?.response?.data || error);
      setError(error.message || "Failed to load profile");
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistData();
  }, []);

  const handleProfileUpdate = async (updatedData) => {
    try {
      if (updatedData.avatarFile) {
        const url = await AWSHelper.upload(
          updatedData.avatarFile,
          profileData.username.replace(/\s+/g, "-").toLowerCase()
        );
        updatedData.avatar = url;
        delete updatedData.avatarFile;
      }

      const displayData = {
        ...updatedData,
        address: updatedData.address
          ? `${updatedData.address.street || ""}, ${
              updatedData.address.city || ""
            }`.trim()
          : "",
      };

      setProfileData((prev) => ({
        ...prev,
        ...displayData,
        socials: {
          ...prev.socials,
          ...(updatedData.socials || {}),
        },
      }));

      toast.success("Profile updated successfully");
      await fetchArtistData(); // Refresh data after update
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchArtistData}>Retry</Button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No profile data available</p>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="h-[300px] bg-gradient-to-br from-primary/20 via-primary/10 to-background relative">
        <div className="absolute inset-0 backdrop-blur-xl" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-32 space-y-8 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="p-6 backdrop-blur-md bg-background/50">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="w-40 h-40 rounded-2xl border-4 border-background shadow-xl overflow-hidden">
                  <img
                    src={profileData.profile_image}
                    alt="Profile"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      {profileData.stageName}
                    </h1>
                    <p className="text-muted-foreground">@{profileData.username}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <EditProfileModal user={profileData} onSave={handleProfileUpdate} />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-muted-foreground">{profileData.bio}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="p-6 backdrop-blur-md bg-background/50">
            <h3 className="text-lg font-semibold mb-4">Connect & Follow</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(profileData.socialLinks).map(([platform, handle]) => (
                <a key={platform} href={`https://${platform}.com/${handle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                  {platform === "instagram" && <Instagram className="w-5 h-5 text-[#E4405F]" />}
                  {platform === "twitter" && <Twitter className="w-5 h-5 text-[#1DA1F2]" />}
                  {platform === "youtube" && <Youtube className="w-5 h-5 text-[#FF0000]" />}
                  {platform === "facebook" && <Facebook className="w-5 h-5 text-[#1877F2]" />}
                  <span className="font-medium">{handle}</span>
                </a>
              ))}
            </div>
          </Card>
        </motion.div>

        <Posts />
      </div>
    </main>
  );
};

export default Profile;
