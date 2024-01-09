const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { createUserToken } = require("../services/authentication");

router.get("/signup", (req, res) => {
  return res.render("Signup");
});

router.get("/signin", (req, res) => {
  return res.render("Signin");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    await User.create({
      fullName,
      email,
      password,
    });

    return res.redirect("/");
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).render("Signup", {
      error: "An error occurred during sign-up.",
    });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    // Update the line below to return the token, not the user
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    console.error("Error signing in:", error);
    return res.render("Signin", {
      error: "Incorrect Email or Password",
    });
  }
});

module.exports = router;
