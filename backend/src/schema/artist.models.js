import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const artistSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone_no: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    age:{
        type: Number,
        required: [true, "Age is required"],
    },
    date_of_birth:{
      type: String,
      required: [true, "Date of birth is required"],
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
      latitude: { type: String },
      longitude: { type: String },
    },
    profile_image: {
        type: String
    },
    gender:{
      type: String,
      required
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isActive: { type: Boolean, 
        default: true 
    },
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
    no_of_shows:{
      type: Number,
      default: 0
    },
    Reviews:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    },
    verifiedStatus: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    refreshToken: {
      type: String,
    },
  },
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
