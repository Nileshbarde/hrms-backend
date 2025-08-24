const express = require("express");
const router = express.Router();
const leadStatusController = require("../controllers/leadStatusController");
const authMiddleware = require("../middleware/authMiddleware");

// Lead Status CRUD
router.post("/create", leadStatusController.createStatus);
router.get("/get_status", leadStatusController.getStatuses);

module.exports = router;
