import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Provide a valid email"],
  },
  password: {
    type: String,
    select: false,
    required: [true, "Please provide a password"],
    minLength: [8, "Password should have at least 8 characters"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Please provide a confirm password"],
    validate: {
      validator: function (confirmPassword) {
        return confirmPassword === this.password;
      },
      message: "Passwords do not match",
    },
  },
  magicToken: {
    type: String,
    select: false,
  },
  magicTokenExpiry: {
    type: Date,
    select: false,
  },
  isSessionActive: {
    type: Boolean,
    default: false,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createMagicToken = function () {
  this.magicToken = crypto.randomBytes(32).toString("hex");
  this.magicTokenExpiry =
    Date.now() + parseInt(process.env.MAGIC_TOKEN_EXPIRES_IN);
  this.isSessionActive = false;

  return this.magicToken;
};

const User = model("User", userSchema);
export default User;
