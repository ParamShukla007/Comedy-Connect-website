import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Followers } from "../models/follower.models.js";

const followArtist = asyncHandler(async (req, res) => {
  const { artistId } = req.body;
  const userId = req.user?._id;

  if (!artistId) {
    throw new ApiError(400, "Artist ID is required");
  }

  let userFollowRecord = await Followers.findOne({ user: userId });

  if (!userFollowRecord) {
    userFollowRecord = new Followers({ user: userId, artist: [] });
  }

  if (userFollowRecord.artist.includes(artistId)) {
    throw new ApiError(400, "You are already following this artist");
  }

  userFollowRecord.artist.push(artistId);
  await userFollowRecord.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, userFollowRecord, "Artist followed successfully")
    );
});

const unfollowArtist = asyncHandler(async (req, res) => {
  const { artistId } = req.body;
  const userId = req.user?._id;

  if (!artistId) {
    throw new ApiError(400, "Artist ID is required");
  }

  let userFollowRecord = await Followers.findOne({ user: userId });

  if (!userFollowRecord || !userFollowRecord.artist.includes(artistId)) {
    throw new ApiError(400, "You are not following this artist");
  }

  userFollowRecord.artist = userFollowRecord.artist.filter(
    (id) => id.toString() !== artistId
  );

  await userFollowRecord.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, userFollowRecord, "Artist unfollowed successfully")
    );
});

const getFollowers = asyncHandler(async (req, res) => {
  const { artistId } = req.body;

  if (!artistId) {
    throw new ApiError(400, "Artist ID is required");
  }

  const followers = await Followers.find({ artist: { $in: [artistId] } })
    .populate("user", "fullName email username profile_image")
    .select("user");

  return res
    .status(200)
    .json(new ApiResponse(200, followers, "Followers retrieved successfully"));
});

const getFollowing = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  console.log(userId);

  const following = await Followers.findOne({ user: userId })
    .populate("artist", "fullName email username profile_image")
    .select("artist");

  return res
    .status(200)
    .json(
      new ApiResponse(200, following, "Following list retrieved successfully")
    );
});

export { followArtist, unfollowArtist, getFollowers, getFollowing }