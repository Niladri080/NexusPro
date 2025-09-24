import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  userName: {type: String, required: true},
  imgUrl: {type: String, required: true},
  category: {type: String, required: true},
  title: {type: String, required: true},
  content: {type: String, required: true},
  tags: [String],
  Comments: [{
    _id: {type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId()},
    byId: {type: String},
    by: {type: String},
    byimg: {type: String},
    comment: {type: String},
    time: {type: String}
  }],
  Likes: {type: Number, required: true, default: 0},
  LikedBy: [{type: String}], // Add this line
  time: {type: Number, required: true}
});
const Post = mongoose.model("Post", PostSchema);
export default Post;