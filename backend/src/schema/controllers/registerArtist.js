import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Artist } from "../models/Artist.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
    }
} 

const registerArtist = asyncHandler( async ( req, res ) => {

    const {fullname, username, email, phone_no, age, date_of_birth, address, profile_image, gender, password, isActive, stageName, bio, yearsExperience, genre, socialMedia, no_of_shows} = req.body;

    const existingArtist = await Artist.findOne({
        $or: [{ username }, { email }]
    })
    if(existingArtist){
        throw new ApiError(409, "User with email or username already exists")
    }
    console.log(username);
    const artist = await Artist.create({
        username: username.toLowerCase(), fullname, email, phone_no, age, date_of_birth, address, profile_image, gender, password, isActive, stageName, bio, yearsExperience, genre, socialMedia, no_of_shows
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

export { registerArtist }