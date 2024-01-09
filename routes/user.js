const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  createUserToken,
  validateToken,
} = require("../.services/authentication");

router.get("/signup", (req, res) => {
  return res.render("Signup");
});
router.get("/signin", (req, res) => {
  return res.render("Signin");
});
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchePasswordandGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    res.render("Signin", {
      error: "Incorrect Email or Password",
    });
  }
  //   console.log("User", user);
});

module.exports = router;
