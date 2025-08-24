const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or "outlook", "yahoo", or custom SMTP
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // your app password
  }
});

module.exports = transporter;
