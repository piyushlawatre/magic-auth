import Email from "../utility/email.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });

    const email = new Email(
      newUser,
      `${req.protocol}://${req.get("host")}/api/v1/users/login`
    );
    await email.sendWelcome();

    res.status(201).json({
      status: "success",
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email: userEmail, password } = req.body;
    if (!userEmail || !password) {
      throw new Error("Please provide both email and password", 400);
    }

    const user = await User.findOne({ email: userEmail }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid email or password", 401);
    }

    const token = jwt.sign({ email: userEmail }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    user.createMagicToken();
    await user.save({ validateBeforeSave: false });

    const email = new Email(
      user,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify?token=${token}`
    );
    await email.sendMagicLinkForSignUp();

    res.status(200).json({
      status: "success",
      message:
        "Login successful! A magic link has been sent to your email. Please check your inbox to proceed.",
      jwt: token,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyMagicLink = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      throw new Error("Invalid or missing token", 400);
    }
    const user = await User.findOne({
      magicToken: token,
      magicTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Token is invalid or has expired", 400);
    }

    user.isSessionActive = true;
    user.magicToken = undefined;
    user.magicTokenExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Magic link verified. Session is now active!",
    });
  } catch (error) {
    next(error);
  }
};
