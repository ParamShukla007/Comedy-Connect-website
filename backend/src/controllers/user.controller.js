import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
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

const registerUser = asyncHandler( async ( req, res ) => {

    const { username, email, fullName, phone_no, age, gender, address, profile_image, password} = req.body

    if(
        [username, email, fullName, phone_no, password].some((field) => field?.trim() === '')
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }, { phone_no }]
    })
    if(existingUser){
        throw new ApiError(409, "User with email or username or Phone Number already exists")
    }

    const user = await User.create({
        username, email, fullName, phone_no, age, gender, address: address || null, profile_image: profile_image || "", password
    })

    const createdUser = await User.findById(user._id).select(
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
            "User Registration Successful"
        )
    )

})

const loginUser = asyncHandler( async ( req, res ) => {

    const { email, username, phone_no, password } = req.body

    if(!(username || email || phone_no)){
        throw new ApiError(400, "Username or Email or Phone Number is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}, {phone_no}]
    })
    if(!user){
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid User Credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

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
            "User Login Successful"
        )
    )

})

const logoutUser = asyncHandler( async ( req, res ) => {

    User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            {},
            "User Logout Successful"
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

const changeCurrentPassword = asyncHandler( async ( req, res ) => {

    const { oldPassword, newPassword, confirmPassword } = req.body

    if(!(oldPassword && newPassword && confirmPassword)){
        throw new ApiError(400, "All passwor fields are required")
    }

    if(!(newPassword === confirmPassword)){
        throw new ApiError(400, "New Password and Confirm Password do not match")
    }

    const user = await User.findById(req.user?._id)

    const isPassCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPassCorrect){
        throw new ApiError(400, "Invalid Password")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully"
        )
    )
})

const getCurrentUser = asyncHandler(async ( req, res ) => {
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user, 
            "Current user fetched successfully"
        )
    )
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    try {
        const { fullName, email, phone_no, gender, profile_image, address } = req.body;
        
        if (!(fullName || email || phone_no || profile_image || address)) {
            throw new ApiError(400, "At least one field is required");
        }

        // Check if user exists
        if (!req.user?._id) {
            throw new ApiError(401, "Unauthorized request");
        }

        const updateFields = {};
        if (fullName) updateFields.fullName = fullName;
        if (email) updateFields.email = email;
        if (phone_no) updateFields.phone_no = phone_no;
        if (profile_image) updateFields.profile_image = profile_image;
        if (address) updateFields.address = address;
        if (gender) updateFields.gender = gender;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateFields },
            { new: true }
        ).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return res.status(200).json(
            new ApiResponse(200, user, "Account details updated successfully")
        );
    } catch (error) {
        console.error("Update error:", error);
        throw new ApiError(error.statusCode || 500, error.message || "Error updating details");
    }
});

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password -refreshToken"); // Exclude sensitive fields

        res.status(200).json(
            new ApiResponse(200, users, "All users fetched successfully")
        );
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};

const getOneUser = async (req, res) => {
  try {
    const { userId } = req.body; // Get artist ID from request body
console.log(userId);

    // Find the artist by ID and exclude sensitive fields
    const userData = await User.findById(userId)
      .select("-password -refreshToken -__v"); // Exclude sensitive fields
    
    // If artist is not found
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }


    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    console.error("Error fetching artist:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { getOneUser, getAllUsers, registerUser , loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails }