const db = require("../config/db"); // your mysql2/promise connection

// ================= SOURCES =================
exports.createSource = async (req, res) => {
  try {
    const { source_name } = req.body;
    const [result] = await db.execute("INSERT INTO leads_source (source_name) VALUES (?)", [source_name]);
    res.json({ success: true, source_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSources = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM leads_source WHERE status=1");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};