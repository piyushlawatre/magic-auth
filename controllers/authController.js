import Email from "../utility/email.js";
import User from "../models/user.js";

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
    res.json({
      statusCode: 200,
      message: "login ",
    });
  } catch (error) {
    next(error);
  }
};
