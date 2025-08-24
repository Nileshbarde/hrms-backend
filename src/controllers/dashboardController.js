const db = require("../config/db");

// Dashboard summary counts
exports.getDashboardCounts = async (req, res) => {
  try {
    const [[users]] = await db.query("SELECT COUNT(*) as totalUsers FROM users");
    const [[leads]] = await db.query("SELECT COUNT(*) as totalLeads FROM leads");
    const [[departments]] = await db.query("SELECT COUNT(*) as totalDepartments FROM departments");
    const [[employees]] = await db.query("SELECT COUNT(*) as totalEmployees FROM users WHERE role = 'employee'");

    res.json({
      success: true,
      data: {
        totalUsers: users.totalUsers,
        totalLeads: leads.totalLeads,
        totalDepartments: departments.totalDepartments,
        totalEmployees: employees.totalEmployees,
      }
    });
  } catch (err) {
    console.error("Dashboard API Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
