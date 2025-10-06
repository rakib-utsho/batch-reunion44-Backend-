const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./src/config/db");
const path = require("path");
const authRoutes = require("./src/routes/authRoutes");
const studentRoutes = require("./src/routes/studentRoutes");

//Connect to Database
connectDB();

const app = express();

// ✅ CORS configuration
const corsOption = {
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
};
app.use(cors(corsOption));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
//routes
app.get("/", (req, res) => {
  res.send("Hello Railway!");
});

app.use("/api/v1", authRoutes);
app.use("/api/v1", studentRoutes);

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on  port ${PORT}`)
);
