import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
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


const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin ;
