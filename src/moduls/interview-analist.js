import mongoose from 'mongoose';


// Define the schema
const interviewAnalistSchema = new mongoose.Schema({
  company: {
    type: String,
    unique:true,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  topics: [
    {
      year: {
        type: String,
        required: true,
      },
      obj: [
        {
          name: {
            type: String,
            required: true,
          },
          value: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
  problems: [
    {
      year: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      practice: {
        type: String,
        required: true,
      },
      frequency: {
        type: String,
        required: true,
      },
      difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const InterviewAnalist =
  mongoose.models.InterviewAnalist ||
  mongoose.model('InterviewAnalist', interviewAnalistSchema);

export default InterviewAnalist;
