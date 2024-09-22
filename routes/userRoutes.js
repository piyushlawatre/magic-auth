import { Router } from "express";
import {
  signUp,
  login,
  verifyMagicLink,
} from "../controllers/authController.js";

const router = Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/verify").post(verifyMagicLink);

export default router;
