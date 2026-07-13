import mongoose from 'mongoose';



const problemSchema = new mongoose.Schema({
  topicnameslug: [       {
type:String,
}
],
  sheets:[{
    name:{
    type:String
   }
  }],
 problemtitle: {
        type: String,
        required: true,
        unique:true,
},
     ischeack: [
        {
          user:{  
            type: String,
           required: true,
          }
    }
     ],
      difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
      },
    leetcodeLink:{
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Problem =
  mongoose.models.Problem ||
  mongoose.model('Problem', problemSchema);

export default Problem;
