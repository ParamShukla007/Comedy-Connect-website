import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageGallery from "./ImageGallery";

const VenueDetailsModal = ({ venue, verificationOtp, onOtpChange, onVerify }) => (
  <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
    <h3 className="text-xl font-bold">{venue.name}</h3>
    <p>Owner: {venue.ownerName}</p>
    <ImageGallery images={venue.gallery || []} />
    <div className="space-y-4 sticky bottom-0 bg-background py-4">
      <Input
        placeholder="Enter verification OTP"
        value={verificationOtp}
        onChange={onOtpChange}
      />
      <Button
        onClick={() => onVerify(venue._id)}
        className="w-full"
      >
        Verify Venue
      </Button>
    </div>
  </div>
);

export default VenueDetailsModal;
