const express = require("express");
const router = express.Router();
const { login, requestOtp, verifyOtp, logout, checkBlacklist, resetPassword, forgotPassword } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/role.middleware");


// Public
router.post("/login", login);
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


// Protected
router.post("/logout", authMiddleware, logout);

// Example protected route with RBAC
router.get("/admin-only", authMiddleware, checkBlacklist, roleMiddleware("admin"), (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});

router.get("/manager-or-sales", authMiddleware, checkBlacklist, roleMiddleware("manager", "sales"), (req, res) => {
  res.json({ message: "Welcome Manager/Sales", user: req.user });
});

module.exports = router;
