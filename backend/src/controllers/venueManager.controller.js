import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { VenueManager } from "../models/venueManager.models.js";

const generateAccessAndRefreshTokens = async (venueManagerId) => {
  try {
    const venueManager = await VenueManager.findById(venueManagerId);
    const accessToken = venueManager.generateAccessToken();
    const refreshToken = venueManager.generateRefreshToken();

    venueManager.refreshToken = refreshToken;
    await venueManager.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating access and refresh tokens");
  }
};

const registerVenueManager = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    fullName,
    phone_no,
    age,
    address,
    profile_image,
    password,
  } = req.body;

  if (
    [
      username,
      email,
      fullName,
      phone_no,
      profile_image,
      password,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await VenueManager.findOne({
    $or: [{ username }, { email }, { phone_no }],
  });
  if (existingUser) {
    throw new ApiError(
      409,
      "Venue Manager with provided credentials already exists"
    );
  }

  const user = await VenueManager.create({
    username: username.toLowerCase(),
    email,
    fullName,
    phone_no,
    age,
    address,
    profile_image,
    password,
  });

  const createdUser = await VenueManager.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Error registering venue manager");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdUser, "Venue Manager Registration Successful")
    );
});

const loginVenueManager = asyncHandler(async (req, res) => {
  const { email, username, phone_no, password } = req.body;

  if (!(username || email || phone_no)) {
    throw new ApiError(400, "Username, Email, or Phone Number is required");
  }

  const user = await VenueManager.findOne({
    $or: [{ username }, { email }, { phone_no }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await VenueManager.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
    .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Login Successful"
      )
    );
});

const logoutVenueManager = asyncHandler(async (req, res) => {
  await VenueManager.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", { httpOnly: true, secure: true })
    .clearCookie("refreshToken", { httpOnly: true, secure: true })
    .json(new ApiResponse(200, {}, "Logout Successful"));
});

const getCurrentVenueManager = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Venue Manager Fetched Successfully"));
});

const updateVenueManagerDetails = asyncHandler(async (req, res) => {
  const { fullName, email, phone_no, profile_image, address } = req.body;

  if (!(fullName || email || phone_no || profile_image || address)) {
    throw new ApiError(400, "At least one field is required");
  }

  const updateFields = {};
  if (fullName) updateFields.fullName = fullName;
  if (email) updateFields.email = email;
  if (phone_no) updateFields.phone_no = phone_no;
  if (profile_image) updateFields.profile_image = profile_image;
  if (address) updateFields.address = address;

  const user = await VenueManager.findByIdAndUpdate(
    req.user?._id,
    { $set: updateFields },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "Error updating details");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

export {
  registerVenueManager,
  loginVenueManager,
  logoutVenueManager,
  getCurrentVenueManager,
  updateVenueManagerDetails,
};
