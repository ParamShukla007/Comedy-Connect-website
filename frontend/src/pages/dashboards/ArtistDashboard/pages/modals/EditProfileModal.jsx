import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Camera,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Edit,
} from "lucide-react";
import AWSHelper from "@/utils/awsHelper";

const EditProfileModal = ({ user, onSave }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(user?.profile_image || "/default-avatar.png");
  const [formData, setFormData] = useState({
    name: user?.fullName || "",
    stageName: user?.stageName || "",
    bio: user?.bio || "",
    profile_image: user?.profile_image || "",
    socials: {
      instagram: user?.socialLinks?.instagram || "",
      twitter: user?.socialLinks?.twitter || "",
      youtube: user?.socialLinks?.youtube || "",
      facebook: user?.socialLinks?.facebook || "",
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullName || "",
        stageName: user.stageName || "",
        bio: user.bio || "",
        profile_image: user.profile_image || "",
        socials: {
          instagram: user?.socialLinks?.instagram || "",
          twitter: user?.socialLinks?.twitter || "",
          youtube: user?.socialLinks?.youtube || "",
          facebook: user?.socialLinks?.facebook || "",
        }
      });
      setPreviewImage(user.profile_image || "/default-avatar.png");
    }
  }, [user]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setImageFile(null);
      setPreviewImage(user?.profile_image || "/default-avatar.png");
      setFormData({
        name: user?.fullName || "",
        stageName: user?.stageName || "",
        bio: user?.bio || "",
        profile_image: user?.profile_image || "",
        socials: {
          instagram: user?.socialLinks?.instagram || "",
          twitter: user?.socialLinks?.twitter || "",
          youtube: user?.socialLinks?.youtube || "",
          facebook: user?.socialLinks?.facebook || "",
        }
      });
    }
  }, [open, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.profile_image;

      if (imageFile) {
        try {
          console.log("Uploading image to AWS...");
          const artistUsername = user?.username || 'artist';
          imageUrl = await AWSHelper.upload(imageFile, artistUsername);
          console.log("Image uploaded:", imageUrl);
        } catch (error) {
          console.error("Image upload error:", error);
          toast.error("Failed to upload image");
          return;
        }
      }

      const artistId = user?._id || localStorage.getItem("userId");
      if (!artistId) {
        toast.error("Artist ID not found");
        return;
      }

      const updateData = {
        artistid: artistId,
        fullName: formData.name,
        stageName: formData.stageName,
        bio: formData.bio,
        profile_image: imageUrl,
        socialLinks: {
          instagram: formData.socials.instagram || "",
          twitter: formData.socials.twitter || "",
          youtube: formData.socials.youtube || "",
          facebook: formData.socials.facebook || "",
        },
      };

      // Remove any undefined or null values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null) {
          delete updateData[key];
        }
      });

      const response = await axios.post(
        "http://localhost:8000/api/artists/updateArtistDetails",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully");
        console.log("Profile updated:", response.data.data);
        onSave(response.data.data);
        setOpen(false);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isLoading && setOpen(isOpen)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Edit className="h-4 w-4" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-4 -mr-4">
          {/* Profile Image Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20">
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <input
                  type="file"
                  name="avatar"
                  className="hidden"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </label>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Profile Photo</h4>
                <p className="text-sm text-muted-foreground">
                  Upload a new profile picture
                </p>
              </div>
            </div>

            {/* Rest of the form fields */}
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    className="bg-background"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stageName">Stage Name</Label>
                  <Input
                    id="stageName"
                    name="stageName"
                    value={formData.stageName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      stageName: e.target.value
                    }))}
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    bio: e.target.value
                  }))}
                  className="bg-background min-h-[100px]"
                  rows={4}
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <Label>Social Media Links</Label>
              {[
                {
                  icon: Instagram,
                  id: "instagram",
                  placeholder: "Instagram username",
                },
                { icon: Twitter, id: "twitter", placeholder: "Twitter handle" },
                {
                  icon: Youtube,
                  id: "youtube",
                  placeholder: "YouTube channel",
                },
                {
                  icon: Facebook,
                  id: "facebook",
                  placeholder: "Facebook profile",
                },
              ].map((social) => (
                <div
                  key={social.id}
                  className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50 focus-within:ring-1 focus-within:ring-primary"
                >
                  <social.icon className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id={social.id}
                    name={`socials.${social.id}`}
                    className="border-0 bg-transparent focus-visible:ring-0 px-0"
                    placeholder={social.placeholder}
                    value={formData.socials[social.id]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socials: {
                        ...prev.socials,
                        [social.id]: e.target.value
                      }
                    }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="sticky bottom-0 pt-6 pb-2 bg-background flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
