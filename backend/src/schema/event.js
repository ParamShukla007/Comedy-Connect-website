const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    venueId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Venue',
      required: true
    },
    primaryArtistId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    },
    supportingArtists: [{
      artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: String,
      performanceOrder: Number
    }],
    eventType: { 
      type: String, 
      enum: ['standup', 'improv', 'sketch', 'open_mic', 'festival', 'workshop', 'other'],
      required: true
    },
    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true }, // HH:MM format
    endTime: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['draft', 'pending_approval', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'draft'
    },
    rejectionReason: String,
    minAge: { type: Number, default: 18 },
    genres: [String],
    tags: [String],
    mediaAssets: {
      thumbnailUrl: String,
      bannerImageUrl: String,
      promotionalVideoUrl: String,
      galleryImages: [String]
    },
    ticketTiers: [{
      name: String,
      description: String,
      price: Number,
      currency: { type: String, default: 'USD' },
      totalQuantity: Number,
      remainingQuantity: Number,
      benefits: [String]
    }],
    isFeatured: { type: Boolean, default: false },
    approvalDate: Date,
    analytics: {
      audienceDemographics: {
        // Can be filled post-event
        ageGroups: {
          "18-24": Number,
          "25-34": Number,
          "35-44": Number,
          "45-54": Number,
          "55+": Number
        },
        genderDistribution: {
          male: Number,
          female: Number,
          other: Number
        }
      }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });