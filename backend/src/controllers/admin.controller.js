import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.models.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await Admin.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
    }
}

const registerAdmin = asyncHandler( async ( req, res ) => {

    const { username, email, password} = req.body

    if(
        [username, email, password].some((field) => field?.trim() === '')
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existingAdmin = await Admin.findOne({
        $or: [{ username }, { email }]
    })
    if(existingAdmin){
        throw new ApiError(409, "User with email or username or Phone Number already exists")
    }

    const admin = await Admin.create({
        username, email, password
    })

    const createdAdmin = await Admin.findById(admin._id).select(
        "-password -refreshToken"
    )

    if(!createdAdmin){
        throw new ApiError(500, "Something went wrong while registering")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            createdAdmin,
            "Admin Registration Successful"
        )
    )

})

const loginAdmin = asyncHandler( async ( req, res ) => {

    const { email, username, password } = req.body

    if(!(username || email)){
        throw new ApiError(400, "Username or Email or Phone Number is required")
    }

    const user = await Admin.findOne({
        $or: [{username}, {email}]
    })
    if(!user){
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid User Credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await Admin.findById(user._id).select("-password -refreshToken");

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
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "Admin Login Successful"
        )
    )

})


const refreshAccessToken = asyncHandler( async ( req, res ) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401, "Invalid Refresh Token")
        }
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, newrefreshToken } = await generateAccessAndRefreshTokens(user._id)
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newrefreshToken},
                "Access Token refreshed successfully"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
})

export { registerAdmin, loginAdmin, refreshAccessToken }