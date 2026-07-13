import mongoose from 'mongoose';



const UserAnswerSchema = new mongoose.Schema({
    mockIdRef: { type: String, required: true },
    question: { type: String, required: true },  
    correctAns: { type: String },               
    userAns: { type: String },                  
    feedback: { type: String },                
    rating: { type: String },                   
    userEmail: { type: String },               
    createdAt: { type: Date, default: Date.now } 
});


const UserAnswer =
  mongoose.models.UserAnswer ||
  mongoose.model('UserAnswer', UserAnswerSchema);

export default UserAnswer;
