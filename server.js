const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const path = require("path");
const studentRoutes = require("./src/routes/studentRoutes");

//Connect to Database
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

//routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/v1", studentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on  port ${PORT}`)
);
