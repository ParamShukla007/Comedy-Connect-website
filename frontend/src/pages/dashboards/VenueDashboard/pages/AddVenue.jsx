import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  X,
  MapPin,
  Users,
  Building2,
  Plus,
  Sparkles,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import AWSHelper from "@/utils/awsHelper";
import { registerVenue } from "@/api/venue.api";
const COMMON_AMENITIES = [
  "Free WiFi",
  "Parking",
  "Air Conditioning",
  "Catering Service",
  "Audio System",
  "Projector",
  "Stage",
  "Security",
  "Restrooms",
  "Elevator Access",
  "Wheelchair Access",
  "Backup Generator",
  "Green Room",
  "Kitchen Facilities",
];

const StepIndicator = ({ currentStep }) => (
  <div className="mb-8">
    <Progress value={currentStep === 1 ? 50 : 100} className="h-2" />
    <div className="flex justify-between mt-2">
      <div className="flex items-center">
        <div
          className={`rounded-full h-8 w-8 flex items-center justify-center ${
            currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          <Check className="h-5 w-5" />
        </div>
        <span className="ml-2 text-sm font-medium">Basic Details</span>
      </div>
      <div className="flex items-center">
        <div
          className={`rounded-full h-8 w-8 flex items-center justify-center ${
            currentStep === 2
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          {currentStep === 2 ? <Check className="h-5 w-5" /> : "2"}
        </div>
        <span className="ml-2 text-sm font-medium">Media & Amenities</span>
      </div>
    </div>
  </div>
);

const AddVenue = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    capacity: 100,
    address: "",
    description: "",
    location: "",
  });

  const [media, setMedia] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Venue name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.location.trim())
      newErrors.location = "Location link is required";
    return newErrors;
  };

  const handleNext = () => {
    const errors = validateStep1();
    if (Object.keys(errors).length === 0) {
      setCurrentStep(2);
      setErrors({});
    } else {
      setErrors(errors);
      toast.error("Please fill in all required fields");
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCapacityChange = (value) => {
    setFormData((prev) => ({ ...prev, capacity: value[0] }));
  };

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 15;

    if (media.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} files`);
      return;
    }

    for (const file of files) {
      try {
        const url = await AWSHelper.upload(
          file,
          formData.name.replace(/\s+/g, "-").toLowerCase()
        );
        setMedia((prev) => [
          ...prev,
          {
            file,
            type: file.type.startsWith("image/") ? "image" : "video",
            url,
          },
        ]);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const removeMedia = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const addCustomAmenity = () => {
    if (
      customAmenity.trim() &&
      !selectedAmenities.includes(customAmenity.trim())
    ) {
      setSelectedAmenities((prev) => [...prev, customAmenity.trim()]);
      setCustomAmenity("");
    }
  };

  const handleGenerateDescription = async () => {
    setIsGeneratingDescription(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const generatedDescription = `This stunning venue located in the heart of the city offers a spacious setting with ${
      formData.capacity
    } person capacity. Featuring ${selectedAmenities
      .slice(0, 3)
      .join(", ")} and more amenities, it's perfect for any event.`;
    setFormData((prev) => ({ ...prev, description: generatedDescription }));
    setIsGeneratingDescription(false);
    toast.success("Description generated!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Convert the media array to URLs only
      const mediaUrls = media.map((m) => m.url);

      const venueData = {
        ...formData,
        media: mediaUrls,
        amenities: selectedAmenities,
      };

      // Your API call to save venue data
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Venue added successfully!");

      // Reset form
      setFormData({
        name: "",
        capacity: 100,
        address: "",
        description: "",
        location: "",
      });
      setMedia([]);
      setSelectedAmenities([]);
      setCurrentStep(1);
    } catch (error) {
      toast.error("Failed to add venue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit}>
        <Card className="shadow-lg border-2">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Add New Venue
            </CardTitle>
            <CardDescription>
              Fill in the details below to add a new venue to your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepIndicator currentStep={currentStep} />

            {currentStep === 1 ? (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Venue Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter venue name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={
                          errors.name ? "border-red-500 rounded" : "rounded"
                        }
                      />
                      {errors.name && (
                        <span className="text-sm text-red-500">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="capacity"
                        className="flex items-center gap-2"
                      >
                        <Users className="h-4 w-4" />
                        Capacity: {formData.capacity} people
                      </Label>
                      <div className="pt-4 px-2">
                        <Slider
                          value={[formData.capacity]}
                          onValueChange={handleCapacityChange}
                          max={1000}
                          min={10}
                          step={10}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                          <span>10</span>
                          <span>1000</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Full venue address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`min-h-[100px] ${
                          errors.address ? "border-red-500 rounded" : "rounded"
                        }`}
                      />
                      {errors.address && (
                        <span className="text-sm text-red-500">
                          {errors.address}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="location"
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        Google Maps Link
                      </Label>
                      <Input
                        id="location"
                        placeholder="Paste Google Maps location link"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className={
                          errors.location
                            ? "border-red-500 rounded mt-1"
                            : "rounded mt-1"
                        }
                      />
                      {errors.location && (
                        <span className="text-sm text-red-500">
                          {errors.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2"
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Media Upload Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Media</h3>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        id="media"
                        multiple
                        accept="image/*,video/*"
                        className="hidden rounded"
                        onChange={handleMediaUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => document.getElementById("media").click()}
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Upload Photos & Videos
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        Upload up to 15 files (images or videos)
                      </p>
                    </div>

                    {media.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {media.map((item, index) => (
                          <div key={index} className="relative group">
                            {item.type === "image" ? (
                              <img
                                src={item.url}
                                alt={`Preview ${index}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            ) : (
                              <video
                                src={item.url}
                                className="w-full h-32 object-cover rounded-lg"
                                controls
                              />
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeMedia(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Amenities Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {COMMON_AMENITIES.map((amenity) => (
                        <Badge
                          key={amenity}
                          variant={
                            selectedAmenities.includes(amenity)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer hover:bg-primary/90"
                          onClick={() => toggleAmenity(amenity)}
                        >
                          {amenity}
                          {selectedAmenities.includes(amenity) ? (
                            <X className="ml-1 h-3 w-3" />
                          ) : (
                            <Plus className="ml-1 h-3 w-3" />
                          )}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add custom amenity"
                        value={customAmenity}
                        onChange={(e) => setCustomAmenity(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && addCustomAmenity()
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addCustomAmenity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Label htmlFor="description">Description</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateDescription}
                      disabled={isGeneratingDescription}
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      {isGeneratingDescription
                        ? "Generating..."
                        : "Generate with AI"}
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the venue"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="min-h-[150px]"
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Details
                  </Button>
                  <Button
                    type="submit"
                    className="flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding Venue..." : "Add Venue"}
                    <Check className="h-4 w-4" />
                  </Button>
                </div>

                <Alert className="mt-6">
                  <AlertDescription>
                    Review all details before submitting. You can go back to
                    edit basic information if needed.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AddVenue;
