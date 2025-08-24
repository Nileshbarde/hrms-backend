const db = require("../config/db"); // your mysql2/promise connection


// ================= STATUSES =================
exports.createStatus = async (req, res) => {
  try {
    const { status_name } = req.body;
    const [result] = await db.execute("INSERT INTO leads_status (status_name) VALUES (?)", [status_name]);
    res.json({ success: true, status_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStatuses = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM leads_status WHERE status=1");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
