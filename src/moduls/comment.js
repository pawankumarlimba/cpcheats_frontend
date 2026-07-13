import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  initialPostId: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  upvotes: [
    {
       user: {
        type: String,
      },
    },
  ],
  replies: [
    {
      replyid: {
        type: String,
      },
      commentid: {
        type: String,
      },
      username: {
        type: String,
      },
      content: {
        type: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.index({ _id: 1, 'upvotes.user': 1 }, { unique: true });
const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;
