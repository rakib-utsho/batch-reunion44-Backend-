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
// Update a post (protected route)
router.put(
  "/post/:id",
  authMiddleware.protect,
  postImageParser.single("postImage"),
  postController.updatePost
);
// Delete a post (protected route)
router.delete("/post/:id", authMiddleware.protect, postController.deletePost);
// Like/Unlike a post (protected route)
router.post("/post/:id/like", authMiddleware.protect, postController.likeUnlikePost);
// Add a comment to a post (protected route)
router.post("/post/:id/comment", authMiddleware.protect, postController.addComment);

module.exports = router;
