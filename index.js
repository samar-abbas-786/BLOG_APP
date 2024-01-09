const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv"); // Add dotenv for environment variables
const helmet = require("helmet"); // Add helmet for security headers
const app = express();
const PORT = process.env.PORT || 5000;
const userRouter = require("./routes/user");

// Load environment variables from .env file
dotenv.config();

// Security middleware
app.use(helmet());

// DATABASE CONNECTION
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BlogApp")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));

app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
