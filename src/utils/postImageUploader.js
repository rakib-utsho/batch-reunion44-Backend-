const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "university-forum/postImages", // Dedicated folder for post images
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 800, crop: "limit" }], // A wider format for posts
  },
});

const postImageParser = multer({ storage: storage });

module.exports = postImageParser;
