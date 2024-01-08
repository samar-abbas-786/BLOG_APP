const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const userRouter = require("./routes/user");

//DATABASE CONNECTION
mongoose.connect("mongodb://localhost:27017/BlogApp").then(() => {
  console.log("MongoDB Connected");
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
