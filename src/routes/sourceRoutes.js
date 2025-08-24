const express = require("express");
const router = express.Router();
const leadSourceController = require("../controllers/leadSourceController");
const authMiddleware = require("../middleware/authMiddleware");

// Lead Sources CRUD
router.post("/create", leadSourceController.createSource);
router.get("/get_sources", leadSourceController.getSources);

module.exports = router;

