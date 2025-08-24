const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const authMiddleware = require("../middleware/authMiddleware");


// Example protected routes
// Leads CRUD
router.post("/create", leadController.createLead);
router.get("/get_leads", leadController.getAllLeads);
router.get("/leads/:id", leadController.getLeadById);
router.put("/leads/:id", leadController.updateLead);
router.delete("/leads/:id", leadController.deleteLead);


module.exports = router;
