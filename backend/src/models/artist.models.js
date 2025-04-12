import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const artistSchema = new Schema(
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
        gender: {
            type: String,
            required: true,
        },
        searchHistory: [
            {
                type: String,
            },
        ],
        stageName:{
            type: String,
        },
        bio: {
            type: String
        },
        yearsExperience:{
            type: Number
        },
        genre: {
            type: [String]
        },
        socialMedia: {
            instagram: String,
            twitter: String,
            youtube: String,
            tiktok: String
        },
        Reviews:[
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            }
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

artistSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

artistSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

artistSchema.methods.generateAccessToken = function () {
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

artistSchema.methods.generateRefreshToken = function () {
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

export const Artist = mongoose.model("Artist", artistSchema);
