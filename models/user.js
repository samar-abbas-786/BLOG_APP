const { error } = require("console");
const JWT = require("jsonwebtoken");
const { randomBytes, createHash, createHmac } = require("crypto");
const { Schema, model } = require("mongoose");
const { createUserToken } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/userImage.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashPassword;
  next();
});

userSchema.static(
  "matchePasswordandGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error("User Not Found");
    }
    const salt = user.salt;
    const hashPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    if (hashPassword !== userProvidedHash)
      throw new Error("Incorrect Password");

    // const token = createUserToken(user);
    // return token;

    return { ...user, password: undefined, salt: undefined };
  }
);

const User = model("User", userSchema);
module.exports = User;
