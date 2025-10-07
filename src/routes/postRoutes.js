const express = require("express");
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

// Import the post parser
const postImageParser = require("../utils/postImageUploader");

const router = express.Router();

// get all posts (public route)
router.get("/post", postController.getAllPost);
// Get a single post by ID (public route)
router.get("/post/:id", postController.getPostById);
// Create a new post (protected route with image upload)
router.post(
  "/post",
  authMiddleware.protect,
  postImageParser.single("postImage"),
  postController.createPost
);

module.exports = router;
