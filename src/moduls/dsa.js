import mongoose from 'mongoose';


const dsaSchema = new mongoose.Schema({
  topicname: {
    type: String,
    required: true,
  },
  sheet:{
    type:String,
    required:true,
  },
  slug: {
    type: String,
    required: true,
  },
  problems: [
    {
      problemid: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Dsa =
  mongoose.models.Dsa ||
  mongoose.model('Dsa', dsaSchema);

export default Dsa;
