import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  deviceInfo: {
    type: String, 
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  username:{
    type:String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,

    unique: true,
  },
  password: {
    type: String,

  },
  accessToken: {
    type: [tokenSchema], 
    default: [], 
  },
  otp: {
    otp: { type: String, required: false }, 
    otpCreatedAt: { type: Date, required: false }  
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null, // Mark as null if not deleted
  },
});


const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
