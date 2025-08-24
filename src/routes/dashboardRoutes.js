const express = require("express");
const router = express.Router();
const { getDashboardCounts } = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/auth"); // only authenticated users

// GET /api/dashboard
router.get("/", authenticate, getDashboardCounts);

module.exports = router;
