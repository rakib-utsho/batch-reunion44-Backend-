const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  },
  { timestamps: true }
);

const PostSchema = new mongoose.Schema(
  {
    author: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
      name: { type: String, required: true },
      profileImage: { type: String },
    },
    content: {
      type: String,
      required: [true, "Post content cannot be empty."],
    },
    postImage: { type: String },
    postType: {
      type: String,
      enum: ["Job", "Resource", "Discussion", "Event"],
      required: true,
    },
    company: { type: String },
    jobTitle: { type: String },
    location: { type: String },
    link: { type: String },
    tags: [String],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
