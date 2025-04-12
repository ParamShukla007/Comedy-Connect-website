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
import { register } from "@/api/user.api";

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

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phone_no: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
    }
  };

  const renderForm = () => (
    <motion.div className="space-y-4">
      {/* Basic Info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Username</Label>
          <Input
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="bg-background border"
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
            className="bg-background border"
            required
          />
        </div>
      </div>

      {/* Password Fields */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="bg-background border"
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
            className="bg-background border"
            required
          />
        </div>
      </div>

      {/* Personal Info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="bg-background border"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input
            name="phone_no"
            value={formData.phone_no}
            onChange={handleInputChange}
            className="bg-background border"
            required
          />
        </div>
      </div>

      {/* Age and Gender */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Age</Label>
          <Input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="bg-background border"
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
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Address Fields */}
      <div className="space-y-4">
        <Label className="text-base">Address</Label>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label>Street Address</Label>
            <Input
              name="address.street"
              value={formData.address.street}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  address: { ...prev.address, street: e.target.value },
                }))
              }
              className="bg-background border"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              name="address.city"
              value={formData.address.city}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value },
                }))
              }
              className="bg-background border"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Input
              name="address.state"
              value={formData.address.state}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  address: { ...prev.address, state: e.target.value },
                }))
              }
              className="bg-background border"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Pincode</Label>
            <Input
              name="address.pincode"
              value={formData.address.pincode}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  address: { ...prev.address, pincode: e.target.value },
                }))
              }
              className="bg-background border"
              required
            />
          </div>
        </div>
      </div>

      <ProfileImageUpload
        profileImage={formData.profileImage}
        onImageChange={handleImageChange}
      />
    </motion.div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSend = {
      ...formData,
      address: {
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        pincode: formData.address.pincode,
      },
    };

    try {
      const response = await axios.post(register, dataToSend);
      // Handle success
      console.log("User registered successfully:", response.data);
    } catch (error) {
      // Handle error
      console.error("Error registering user:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <PageTransition>
        <Card className="auth-card max-w-xl w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Join our comedy events platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderForm()}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </PageTransition>
    </AuthLayout>
  );
};

export default Signup;
