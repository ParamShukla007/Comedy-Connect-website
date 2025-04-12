import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X } from "lucide-react";

const ManageVenueModal = ({ isOpen, onClose, venue, onUpdate }) => {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [newFeature, setNewFeature] = useState('');

  // Reset form when venue changes
  useEffect(() => {
    if (venue) {
      setSelectedVenue({ ...venue });
    }
  }, [venue]);

  // Don't render if no venue is selected
  if (!selectedVenue) return null;

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setSelectedVenue(prev => ({
      ...prev,
      features: [...prev.features, newFeature.trim()]
    }));
    setNewFeature('');
  };

  const removeFeature = (indexToRemove) => {
    setSelectedVenue(prev => ({
      ...prev,
      features: prev.features.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = () => {
    onUpdate(selectedVenue);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedVenue(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Manage Venue: {selectedVenue.name}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Venue Details</TabsTrigger>
            <TabsTrigger value="features">Features & Amenities</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4 pt-4">
            <Input
              name="name"
              placeholder="Venue Name"
              value={selectedVenue.name}
              onChange={handleInputChange}
            />
            <Input
              name="capacity"
              type="number"
              placeholder="Capacity"
              value={selectedVenue.capacity}
              onChange={handleInputChange}
            />
            <Input
              name="location"
              placeholder="Location"
              value={selectedVenue.location}
              onChange={handleInputChange}
            />
            <div className="flex gap-2">
              <Button variant="outline" className="w-full" onClick={onClose}>
                Cancel
              </Button>
              <Button className="w-full" onClick={handleSubmit}>
                Save Changes
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="features" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add new feature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                />
                <Button onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {selectedVenue.features.map((feature, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="p-2 flex justify-between items-center"
                  >
                    {feature}
                    <X 
                      className="h-4 w-4 ml-2 cursor-pointer hover:text-destructive" 
                      onClick={() => removeFeature(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ManageVenueModal;
