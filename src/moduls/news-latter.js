import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  accessToken:{
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Newsletter = mongoose.models.Newsletter || mongoose.model("Newsletter", newsletterSchema);

export default Newsletter ;
