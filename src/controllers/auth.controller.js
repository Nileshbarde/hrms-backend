const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { signToken } = require("../utils/jwt");
const User = require("../models/user.model");

const resetTokens = {};
// In-memory blacklist (for demo; use Redis in production)
const tokenBlacklist = new Set();

/**
 * Password-based login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken({ id: user.id, role: user.role, name: user.name });

    return res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Request OTP (send via email)
 */
const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // valid 5 min

    // Save OTP to DB
    await User.updateOtp(user.id, otp, otpExpiresAt);

    // Configure email transport
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use SMTP settings
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return res.json({ message: "OTP sent to email" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Verify OTP (login with OTP)
 */
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (new Date() > new Date(user.otp_expires_at))
      return res.status(400).json({ message: "OTP expired" });

    // Clear OTP after use
    await User.updateOtp(user.id, null, null);

    // Issue JWT
    const token = signToken({ id: user.id, role: user.role, name: user.name });

    return res.json({
      token,
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



/**
 * Request password reset
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await User.saveResetToken(user.id, resetToken, expiresAt);

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // Setup mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>This link expires in 15 minutes.</p>`,
    });

    res.json({ message: "Reset link sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findByResetToken(token);
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.id, hashedPassword);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Logout (blacklist JWT)
 */
const logout = (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(400).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  tokenBlacklist.add(token);
  return res.json({ message: "Logged out successfully" });
};

/**
 * Check blacklist middleware
 */
const checkBlacklist = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token && tokenBlacklist.has(token)) {
    return res.status(401).json({ message: "Token is blacklisted, please login again" });
  }
  next();
};

module.exports = { login, requestOtp, verifyOtp, logout, checkBlacklist, forgotPassword, resetPassword };
