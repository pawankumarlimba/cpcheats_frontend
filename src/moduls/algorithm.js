import mongoose from 'mongoose';

// Define the User Schema
const AlgorithmSchema = new mongoose.Schema({
    name: { 
        type: String,
         required: true 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true
     },
    description: {
         type: String,
          required: true
         },
    timeComplexity: { 
        type: String, 
        required: true
     },
    spaceComplexity: {
         type: String,
          required: true
         },
    use: { 
        type: String, 
        required: true },
    code: {
         type: Map, of: String, 
         required: true },
    execute: { 
          type: String, 
          required: true
         },
    user:{
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



const Algorithm = mongoose.models.Algorithm || mongoose.model("Algorithm", AlgorithmSchema);

export default Algorithm ;
