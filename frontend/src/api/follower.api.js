import SERVER_API from "./server.api.js";
export const followArtist = `${SERVER_API}/followers/follow-artist`;
export const unfollowArtist = `${SERVER_API}/followers/unfollow-artist`;
export const getFollowers = `${SERVER_API}/followers/get-followers`;
export const getFollowings = `${SERVER_API}/followers/get-followings`;