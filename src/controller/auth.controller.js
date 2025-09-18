import jwt from "jsonwebtoken";

// models
import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";

// services
import sendEmail from "../services/email.service.js";

// templates
import {
  registrationVerificationEmail,
  welcomeEmail,
} from "../templates/emailTemplates.js";

// utils
import { generateOTP } from "../utils/Number.js";

// generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    // check if user already exists and email is verified
    if (existingUser && existingUser.isEmailVerified) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // generate OTP(6 digits)
    const otp = generateOTP();

    let user;

    // if user exists but email is not verified then overwriting the document
    if (existingUser && !existingUser.isEmailVerified) {
      existingUser.name = name;
      existingUser.password = password; // will be hashed by pre('save')
      user = await existingUser.save();
    } else {
      // if user is not exists then creating new user
      user = await User.create({
        name,
        email,
        password,
        lastLogin: new Date(),
      });
    }

    // after the account is created/updated now sending otp to the mail
    await sendEmail(
      email,
      "Verify Your Email - Expense Tracker",
      registrationVerificationEmail(otp, name)
    );

    // create OTP document
    await OTP.create({
      user: user._id,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
    });

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully! Please verify your email to continue",
      data: {
        email: user.email,
        userId: user._id,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found, please sign up",
      });
    }

    // check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // check if email is verified
    if (!user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is not verified, please verify your email",
        code: "EMAIL_NOT_VERIFIED",
        userId: user._id,
        email: user.email,
      });
    }

    // generate token
    const token = generateToken(user._id);

    // update last login
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { token },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    // find user
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified, please login",
        code: "EMAIL_ALREADY_VERIFIED",
      });
    }

    // find the OTP document
    const otpDoc = await OTP.findOne({ user: userId }).sort({ createdAt: -1 });
    if (!otpDoc) {
      return res.status(404).json({
        success: false,
        message: "OTP invalid or expired",
      });
    }

    // if now time is more than otpExipreAt time then it means OTP is expired
    const now = new Date();
    if (now > otpDoc.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    otpDoc.attempts += 1; // incrementing the attempts

    if (otpDoc.attempts > 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum attempts exceeded",
      });
    }

    if (otpDoc.otp !== otp.toString()) {
      await otpDoc.save();
      return res.status(400).json({
        success: false,
        message: "The OTP you entered is incorrect",
      });
    }

    await otpDoc.save(); // record successful attempt

    // update user's email verification status
    user.isEmailVerified = true;
    await user.save();

    // send welcome email
    await sendEmail(
      user.email,
      "Welcome to Expense Tracker!",
      welcomeEmail(user.name)
    );

    // generate token for immediate login
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! Welcome to Expense Tracker",
      data: { token },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    // find user
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // check if user is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified, please login",
        code: "EMAIL_ALREADY_VERIFIED",
      });
    }

    // generate new OTP
    const otp = generateOTP();

    // send verification email
    await sendEmail(
      user.email,
      "Verify Your Email - Expense Tracker",
      registrationVerificationEmail(otp, user.name)
    );

    // create new OTP document
    await OTP.create({
      user: userId,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
    });

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
