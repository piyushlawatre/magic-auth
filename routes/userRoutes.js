import { Router } from "express";
import {
  signUp,
  login,
  verifyMagicLink,
  protect,
  getUser,
} from "../controllers/authController.js";

const router = Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/verify").post(verifyMagicLink);

// This is protected route
router.route("/user").get(protect, getUser);

export default router;
