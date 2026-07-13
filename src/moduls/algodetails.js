import mongoose from 'mongoose';


const algodetailsSchema = new mongoose.Schema({
  topicname: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  details:{
    type: String,
    required: true,
  },
  freqquestion: [
    {
   question:{
type:String,
   },
  answer:{
    type:String,
  }
  }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Algodetails =
  mongoose.models.Algodetails ||
  mongoose.model('Algodetails', algodetailsSchema);

export default Algodetails;
