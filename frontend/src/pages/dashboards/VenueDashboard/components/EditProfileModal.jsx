import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check, Upload } from "lucide-react";
import AWSHelper from '@/utils/awsHelper';

const EditProfileModal = ({ isOpen, onClose, managerData, onUpdate, imagePreview, onImageUpload }) => {
  const [formData, setFormData] = useState({
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
    }
  });

  useEffect(() => {
    setFormData({
      fullName: managerData.fullName || '',
      email: managerData.email || '',
      phone_no: managerData.phone_no || '',
      address: managerData.address || {
        street: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: ''
      }
    });
  }, [managerData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 cursor-pointer relative group">
              <AvatarImage src={imagePreview || managerData.profile_image} />
              <AvatarFallback>{formData.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              <input
                type="file"
                className="hidden"
                id="avatar-upload"
                accept="image/*"
                onChange={onImageUpload}
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Upload className="h-6 w-6 text-white" />
              </div>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="text-sm text-muted-foreground cursor-pointer hover:text-primary"
            >
              Click to upload profile picture
            </label>
          </div>
          
          <Input
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          />
          
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
          
          <Input
            placeholder="Phone Number"
            value={formData.phone_no}
            onChange={(e) => setFormData(prev => ({ ...prev, phone_no: e.target.value }))}
          />
          
          {/* Address Fields */}
          <div className="space-y-2">
            <Input
              placeholder="Street"
              value={formData.address.street}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                address: { ...prev.address, street: e.target.value }
              }))}
            />
            <Input
              placeholder="City"
              value={formData.address.city}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                address: { ...prev.address, city: e.target.value }
              }))}
            />
            <Input
              placeholder="State"
              value={formData.address.state}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                address: { ...prev.address, state: e.target.value }
              }))}
            />
            <Input
              placeholder="Pincode"
              value={formData.address.pincode}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                address: { ...prev.address, pincode: e.target.value }
              }))}
            />
          </div>

          <Button type="submit" className="w-full">
            <Check className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;