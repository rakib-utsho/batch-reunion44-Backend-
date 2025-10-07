const PostModel = require("../models/post.model");
const studentModel = require("../models/Student.model");

// create a new post
async function createPost(req, res) {
  try {
    const { content, postType, company, jobTitle, location, link, tags } =
      req.body;
    const authorId = req.student._id;

    const user = await studentModel.findById(authorId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not valid",
      });
    }

    // Embedded author object
    const author = {
      id: user.id,
      name: user.name,
      profileImage: user.profileImage,
    };

    // The data to create the post
    const postData = {
      author,
      content,
      postType,
      company,
      jobTitle,
      location,
      link,
      tags,
    };
    // Check if an image was uploaded
    if (req.file && req.file.path) {
      postData.postImage = req.file.path; // Add the Cloudinary URL to our data
    }

    // Validate required fields
    if (!content || !postType) {
      return res.status(400).json({
        success: false,
        message: "Content and post type are required.",
      });
    }

    const post = await PostModel.create(postData);
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ======== GET ALL POSTS (with pagination and filtering) ==========

async function getAllPost(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { postType, tags } = req.query;
    let filter = {};

    if (postType) filter.postType = postType;
    if (tags) filter.tags = { $in: tags.split(",") }; // search for multiple tags

    const totalPosts = await PostModel.countDocuments(filter);

    const posts = await PostModel.find(filter)
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      meta: {
        total: totalPosts,
        page,
        limit,
        totalPosts: Math.ceil(totalPosts / limit),
      },
      data: posts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ======== GET A SINGLE POST BY ID ==========
async function getPostById(req, res) {
  try {
    const { id } = req.params;
    const post = await PostModel.findById(id)
      .populate("author", "name profileImage email") // Post author
      .populate("comments.author", "name profileImage"); // Comment authors

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { createPost, getAllPost, getPostById };
