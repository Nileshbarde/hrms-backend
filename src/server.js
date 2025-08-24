const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const leadRoutes = require('./routes/leadRoutes');
const sourceRoutes = require('./routes/sourceRoutes');
const statusRoutes = require('./routes/statusRoutes');
const { checkBlacklist } = require("./controllers/auth.controller");
const { getDashboardCounts } = require("./controllers/dashboardController");

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to check token blacklist globally
app.use(checkBlacklist);

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/dashboard', getDashboardCounts);
app.use('/api/leads', leadRoutes);
app.use('/api/source', sourceRoutes);
app.use('/api/status', statusRoutes);


// app.use('/api/holidays', holidayRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
