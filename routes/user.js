const express = require("express");
const router = express.Router();
const User = require("../models/user");

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
  const user = await User.matchePassword(email, password);
  console.log("User", user);
  return res.redirect("/");
});

module.exports = router;
