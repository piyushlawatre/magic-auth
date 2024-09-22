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
      throw new AppError("Please provide both email and password", 400);
    }

    const user = await User.findOne({ userEmail }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = jwt.sign({ userEmail }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    user.magicToken = token;
    user.magicTokenExpiry =
      Date.now() + parseInt(process.env.MAGIC_TOKEN_EXPIRES_I);

    await user.save();

    const email = new Email(
      newUser,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify?token=${token}`
    );
    await email.sendMagicLinkForSignUp();

    res.status(200).json({
      status: "success",
      message:
        "Login successful! A magic link has been sent to your email. Please check your inbox to proceed.",
    });
  } catch (error) {
    next(error);
  }
};
