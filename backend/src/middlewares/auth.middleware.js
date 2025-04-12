import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { Artist } from "../models/artist.models.js";
import {  VenueManager } from "../models/venueManager.models.js";
import { Admin } from "../models/admin.models.js";

export const verifyJWT = asyncHandler( async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        const artist = await Artist.findById(decodedToken?._id).select("-password -refreshToken")
        const venueManager = await VenueManager.findById(decodedToken?._id).select("-password -refreshToken")
        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user && !artist && !venueManager && !admin){
            throw new ApiError(401, "Invalid Access Token")
        }
          if(user){
            req.user = user;
        } else if(artist){
            req.user = artist;
        } else if(venueManager){
            req.user = venueManager;
        } else if(admin){
            req.user = admin;
        }
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})