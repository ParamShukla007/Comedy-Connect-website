import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const venueManagerSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            lowerCase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowerCase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        phone_no: {
            type: String,
            required: true,
            trim: true,
        },
        age:{
            type: Number,
            required: true,
        },
        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            pincode: { type: String, trim: true },
            latitude: { type: String },
            longitude: { type: String }
        },
        profile_image: {
            type: String, //image url
            required: true,
        },
        searchHistory: [
            {
                type: String,
            },
        ],
        isVerified:{
            type: Boolean,
            default: false,
        },
        verificationToken:{
            type: String,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

venueManagerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

venueManagerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

venueManagerSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

venueManagerSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const VenueManager = mongoose.model("VenueManager", venueManagerSchema);
