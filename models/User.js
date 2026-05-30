import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true},
    username: { type: String, unique: true },
    password: { type: String },
    profilepic: { type: String },
    coverpic: { type: String },
    razorpayid: { type: String },
    razorpaysecret: { type: String },

    // New field for Google OAuth
    googleRefreshToken: { type: String, select: false },
    googleAccessToken: { type: String, select: false },

    provider: {
        type: String,
        enum: ["credentials", "google", "github"],
        default: "credentials"
    },

    googleId: { type: String },

}, { timestamps: true })

const User = mongoose.models.User || model("User", UserSchema)
export default User