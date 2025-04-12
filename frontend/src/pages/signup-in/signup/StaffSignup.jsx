import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import AuthLayout from "../AuthLayout";
import { Label } from "@/components/ui/label";
import { Camera, Instagram, Twitter, Facebook } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import axios from "axios";
import { registerArtist } from "@/api/artist.api";
import { registerVenueManager } from "@/api/venueManager.api";

const SocialMediaInput = ({ icon: Icon, id, placeholder, value, onChange }) => (
  <div className="flex items-center gap-2 p-3 rounded-lg border bg-background focus-within:ring-1 focus-within:ring-primary">
    <Icon className="h-5 w-5 text-muted-foreground" />
    <Input
      name={`socialMedia.${id}`}
      value={value}
      onChange={onChange}
      className="border-0 bg-transparent focus-visible:ring-0 px-0"
      placeholder={placeholder}
    />
  </div>
);

const ProfileImageUpload = ({ profileImage, onImageChange }) => (
  <div className="space-y-2">
    <Label>Profile Image</Label>
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-2 border-primary/20 overflow-hidden">
          {profileImage ? (
            <img
              src={URL.createObjectURL(profileImage)}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <Camera className="h-8 w-8 text-primary/40" />
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
          id="profile-image"
        />
        <label
          htmlFor="profile-image"
          className="absolute bottom-0 right-0 p-1 rounded-full bg-primary text-white cursor-pointer hover:bg-primary/90"
        >
          <Camera className="h-4 w-4" />
        </label>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>Upload your profile picture</p>
        <p>Max size: 2MB</p>
      </div>
    </div>
  </div>
);

const StaffSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userType: "",
    username: "",
    email: "",
    fullName: "",
    phone_no: "",
    age: "",
    gender: "",
    address: "",
    profileImage: null,
    password: "",
    confirmPassword: "",
    stageName: "",
    bio: "",
    yearsOfExperience: "",
    genre: "",
    socialMedia: {
      instagram: "",
      twitter: "",
      facebook: "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialMedia.")) {
      const social = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [social]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
    }
  };

  const renderUserTypeSelection = () => (
    <div className="space-y-2">
      <Label>Select Staff Type</Label>
      <Select
        value={formData.userType}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, userType: value }))
        }
      >
        <SelectTrigger className="w-full bg-background border">
          <SelectValue placeholder="Select staff type" />
        </SelectTrigger>
        <SelectContent className="bg-background border">
          <SelectItem value="venue" className="cursor-pointer hover:bg-muted">
            Venue Manager
          </SelectItem>
          <SelectItem value="artist" className="cursor-pointer hover:bg-muted">
            Artist
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderCommonFields = () => (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Username</Label>
          <Input
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="bg-background"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="bg-background"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="bg-background"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="bg-background"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="bg-background"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input
            name="phone_no"
            value={formData.phone_no}
            onChange={handleInputChange}
            className="bg-background"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Age</Label>
          <Input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="bg-background"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, gender: value }))
            }
          >
            <SelectTrigger className="bg-background border">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-background border">
              <SelectItem
                value="male"
                className="cursor-pointer hover:bg-muted"
              >
                Male
              </SelectItem>
              <SelectItem
                value="female"
                className="cursor-pointer hover:bg-muted"
              >
                Female
              </SelectItem>
              <SelectItem
                value="other"
                className="cursor-pointer hover:bg-muted"
              >
                Other
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Address</Label>
        <Textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="bg-background min-h-[100px]"
          required
        />
      </div>

      <ProfileImageUpload
        profileImage={formData.profileImage}
        onImageChange={handleImageChange}
      />
    </motion.div>
  );

  const renderArtistFields = () => (
    <motion.div
      className="space-y-6 mt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="text-lg font-semibold">Artist Details</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Stage Name</Label>
            <Input
              name="stageName"
              value={formData.stageName}
              onChange={handleInputChange}
              className="bg-background"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Years of Experience</Label>
            <Input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              className="bg-background"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Bio</Label>
          <Textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="bg-background min-h-[100px]"
            placeholder="Tell us about yourself..."
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Genre</Label>
          <Select
            value={formData.genre}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, genre: value }))
            }
          >
            <SelectTrigger className="bg-background border">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent className="bg-background border">
              <SelectItem
                value="standup"
                className="cursor-pointer hover:bg-muted"
              >
                Stand-up Comedy
              </SelectItem>
              <SelectItem
                value="improv"
                className="cursor-pointer hover:bg-muted"
              >
                Improv
              </SelectItem>
              <SelectItem
                value="sketch"
                className="cursor-pointer hover:bg-muted"
              >
                Sketch Comedy
              </SelectItem>
              <SelectItem
                value="other"
                className="cursor-pointer hover:bg-muted"
              >
                Other
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Social Media Links</Label>
          {Object.entries({
            instagram: { icon: Instagram, placeholder: "Instagram username" },
            twitter: { icon: Twitter, placeholder: "Twitter handle" },
            facebook: { icon: Facebook, placeholder: "Facebook profile" },
          }).map(([platform, { icon: Icon, placeholder }]) => (
            <div
              key={platform}
              className="flex items-center gap-2 p-3 rounded-lg border bg-background"
            >
              <Icon className="h-5 w-5 text-muted-foreground" />
              <Input
                name={`socialMedia.${platform}`}
                value={formData.socialMedia[platform]}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSend = {
      ...formData,
      address: formData.address,
      socialMedia: formData.socialMedia,
      profile_image: formData.profileImage
        ? URL.createObjectURL(formData.profileImage)
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxw0eitGgbS6Y3kJODK5lGbWxUV8sONkQUZg&s",
    };

    try {
      if (formData.userType === "artist") {
        await axios.post(registerArtist, dataToSend);
      } else if (formData.userType === "venue") {
        await axios.post(registerVenueManager, dataToSend);
      }
      // Handle success
      console.log("Staff registered successfully");
    } catch (error) {
      // Handle error
      console.error("Error registering staff:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <PageTransition>
        <Card className="auth-card max-w-2xl w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Create Staff Account
            </CardTitle>
            <CardDescription className="text-center">
              Join as a {formData.userType || "staff member"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderUserTypeSelection()}

              {formData.userType && (
                <>
                  {renderCommonFields()}
                  {formData.userType === "artist" && renderArtistFields()}
                </>
              )}

              {formData.userType && (
                <Button type="submit" className="w-full" disabled={isLoading}>
                  Create Account
                </Button>
              )}
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              Already have an account?{" "}
              <Link to="/staffsignin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </PageTransition>
    </AuthLayout>
  );
};

export default StaffSignup;
