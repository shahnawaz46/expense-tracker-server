import express from "express";
import {
  signup,
  signin,
  verifyOTP,
  resendOTP,
  logout,
} from "../controller/auth.controller.js";

// middleware
import { validateRequest } from "../middleware/validateRequest.middleware.joi.js";

// validation schemas
import {
  signupSchema,
  signinSchema,
  verifyOTPSchema,
  resendOTPSchema,
} from "../validation/authValidation.joi.js";

const router = express.Router();

router.post("/signup", validateRequest(signupSchema), signup);
router.post("/signin", validateRequest(signinSchema), signin);
router.post("/verify-otp", validateRequest(verifyOTPSchema), verifyOTP);
router.post("/resend-otp", validateRequest(resendOTPSchema), resendOTP);
router.post("/logout", logout);

export default router;
