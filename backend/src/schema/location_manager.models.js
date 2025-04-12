import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const location_managerSchema = new Schema(
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
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isActive: { type: Boolean, 
        default: true 
    },
    companyName:{
        type: String,
       
    },
    businessAddress: {
        type: String
    },
    yearsExperience:{
        type: Number
    },
    portfolio: {
        type: String
    },
    verificationDocuments: [{ 
        type: String, // URLs to documents
        description: String
    }],
    verifiedStatus: { type: Boolean, default: false },
    lastLogin: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    refreshToken: {
      type: String,
    },
  },
);

location_managerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

location_managerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

location_managerSchema.methods.generateAccessToken = function () {
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

location_managerSchema.methods.generateRefreshToken = function () {
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

export const Location_manager = mongoose.model("Location_manager", location_managerSchema);
