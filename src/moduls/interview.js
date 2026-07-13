import mongoose from 'mongoose';

// Define the User Schema
const interviewSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  issee:{
    type:Boolean,
    default:false,
  },
  companyname: {
    type: String,
  },
  details: {
    type: String,

  },
  date: {
    type: String,  
  },
  isemail:{
    type:Boolean,
    default:false,
  },
  slug:{
    type:String,
  },
  accessToken:{
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Interview = mongoose.models.Interview || mongoose.model("Interview", interviewSchema);

export default Interview ;
