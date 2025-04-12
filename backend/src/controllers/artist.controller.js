import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Artist } from "../models/artist.models.js";
import { Followers } from "../models/follower.models.js";

const generateAccessAndRefreshTokens = async(artistId) => {
    try {
        const artist = await Artist.findById(artistId)
        const accessToken = artist.generateAccessToken()
        const refreshToken = artist.generateRefreshToken()

        artist.refreshToken = refreshToken
        await artist.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
    }
} 

const registerArtist = asyncHandler( async ( req, res ) => {
  const {fullName, username, email, phone_no, age,  address, profile_image, gender, password, stageName, bio, yearsExperience, genre, socialMedia} = req.body;

  if([username, email, fullName, phone_no, gender, password].some((field) => field?.trim() === '')) {
        throw new ApiError(400, "All fields are required")
    }

  const existingArtist = await Artist.findOne({
      $or: [{ username }, { email }, { phone_no }]
  })
  if(existingArtist){
      throw new ApiError(409, "User with email or username or Phone Number already exists")
  }
  const artist = await Artist.create({
      username: username.toLowerCase(), fullName, email, phone_no, age, address, profile_image, gender, password, stageName, bio, yearsExperience, genre, socialMedia
  })

  const createdUser = await Artist.findById(artist._id).select(
      "-password -refreshToken"
  )

  if(!createdUser){
      throw new ApiError(500, "Something went wrong while registering")
  }

  return res
  .status(201)
  .json(
      new ApiResponse(
          200,
          createdUser,
          "Artist Registration Successful"
      )
  )

})

const loginArtist = asyncHandler( async ( req, res ) => {

    const { email, username, phone_no, password } = req.body

    if(!(username || email || phone_no)){
        throw new ApiError(400, "Username or Email or Phone Number is required")
    }

    const artist = await Artist.findOne({
        $or: [{username}, {email}, {phone_no}]
    })
    if(!artist){
        throw new ApiError(404, "Artist does not exist");
    }

    const isPasswordValid = await artist.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid User Credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(artist._id);

    const loggedInArtist = await Artist.findById(artist._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInArtist,
                accessToken,
                refreshToken
            },
            "Artist Login Successful"
        )
    )

})

const getOneArtist = async (req, res) => {
  try {
    // Check both body and query for artistId
    const artistId = req.body.artistId || req.query.artistId;
    console.log("Received artistId:", artistId);

    if (!artistId) {
      return res.status(400).json({ 
        success: false, 
        message: "Artist ID is required" 
      });
    }

    const artistData = await Artist.findById(artistId)
      .select("-password -refreshToken -__v");

    if (!artistData) {
      return res.status(404).json({ 
        success: false, 
        message: "Artist not found" 
      });
    }

    const followersCount = await Followers.countDocuments({
      artist: artistId,
    });

    const responseData = {
      ...artistData.toObject(),
      followersCount,
    };

    res.status(200).json({ 
      success: true, 
      data: responseData 
    });
  } catch (error) {
    console.error("Error in getOneArtist:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

const getAllArtist = async (req, res) => {
    try {
      const artists = await Artist.find()
        // .populate({
        //   path: "Reviews",
        //   select: "-__v", // Exclude version field from Reviews
        // })
        .select("-password -refreshToken -__v"); // Exclude sensitive and version fields
  
      // Add followers count for each artist
      const artistsWithFollowers = await Promise.all(
        artists.map(async (artist) => {
          const followersCount = await Followers.countDocuments({
            artist: artist._id,
          });
          return {
            ...artist.toObject(),
            followersCount,
          };
        })
      );
  
      res.status(200).json({ success: true, data: artistsWithFollowers });
    } catch (error) {
      console.error("Error fetching artists:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  const viewArtist = async (req, res) => {
    try {
      const { artistId } = req.body; // Get artist ID from URL parameters
  
      // Find the artist and select the specified fields
      const artistDetails = await Artist.findById(artistId)
        // .populate({
        //   path: "Reviews",
        //   select: "-__v", // Exclude version field from Reviews
        // })
        .select(
          "fullname username age gender profile_image stageName bio yearsExperience genre socialMedia Reviews"
        );
  
      // If artist is not found
      if (!artistDetails) {
        return res
          .status(404)
          .json({ success: false, message: "Artist not found" });
      }
  
      // Count the number of followers for the artist
      const followersCount = await Followers.countDocuments({
        artist: artistId,
      });
  
      // Attach followersCount to artistDetails
      const responseData = {
        ...artistDetails.toObject(),
        followersCount,
      };
  
      res.status(200).json({ success: true, data: responseData });
    } catch (error) {
      console.error("Error fetching artist details:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  
  const updateArtistDetails = asyncHandler(async (req, res) => {
    const { 
        fullName, 
        stageName, 
        bio, 
        profile_image,
        socialLinks, // {instagram, twitter, facebook, youtube}// {type: "audio/video", url: "link"}
    } = req.body;
    
    // Check if at least one field is provided
    if (!(fullName || stageName || bio || profile_image || socialLinks  )) {
        throw new ApiError(400, "At least one field is required for update");
    }

    // Create update object with only provided fields
    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (stageName) updateFields.stageName = stageName;
    if (bio) updateFields.bio = bio;
    if (profile_image) updateFields.profile_image = profile_image;


    // Handle nested social media links
    if (socialLinks) {
        updateFields.socialLinks = {};
        if (socialLinks.instagram) updateFields.socialLinks.instagram = socialLinks.instagram;
        if (socialLinks.twitter) updateFields.socialLinks.twitter = socialLinks.twitter;
        if (socialLinks.facebook) updateFields.socialLinks.facebook = socialLinks.facebook;
        if (socialLinks.youtube) updateFields.socialLinks.youtube = socialLinks.youtube;
    }
    const {artistid} = req.body;
    // Update artist document
    const updatedArtist = await Artist.findByIdAndUpdate(
        artistid, // Assuming you have artist middleware setting req.artist
        { $set: updateFields },
        { new: true }
    ).select("-password -refreshToken");

    if (!updatedArtist) {
        throw new ApiError(404, "Error updating artist details");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedArtist,
            "Artist details updated successfully"
        )
    );
});


export { updateArtistDetails };

export { registerArtist , loginArtist , getOneArtist , getAllArtist, viewArtist}