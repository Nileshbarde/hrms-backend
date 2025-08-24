const db = require("../config/db"); // your mysql2/promise connection

// ================= LEADS =================
exports.createLead = async (req, res) => {
  try {
    const { source_id, status_id, lead_name, number, alternate_number, email, description, company_name } = req.body;
    const [result] = await db.execute(
      `INSERT INTO leads (source_id, status_id, lead_name, number, alternate_number, email, description, company_name) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [source_id, status_id, lead_name, number, alternate_number, email, description, company_name]
    );
    res.json({ success: true, message: "Lead created", lead_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllLeads = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT l.*, s.source_name, st.status_name
       FROM leads l
       JOIN leads_source s ON l.source_id = s.id
       JOIN leads_status st ON l.status_id = st.id`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM leads WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Lead not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const { source_id, status_id, lead_name, number, alternate_number, email, company_name, status } = req.body;
    await db.execute(
      `UPDATE leads SET source_id=?, status_id=?, lead_name=?, number=?, alternate_number=?, email=?, company_name=?, status=? WHERE id=?`,
      [source_id, status_id, lead_name, number, alternate_number, email, company_name, status, req.params.id]
    );
    res.json({ success: true, message: "Lead updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    await db.execute("DELETE FROM leads WHERE id=?", [req.params.id]);
    res.json({ success: true, message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
