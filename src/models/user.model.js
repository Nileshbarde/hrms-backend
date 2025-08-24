const pool = require("../config/db");

const User = {
  findByEmail: async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  },

  updateOtp: async (id, otp, otpExpiresAt) => {
    await pool.query(
      "UPDATE users SET otp = ?, otp_expires_at = ? WHERE id = ?",
      [otp, otpExpiresAt, id]
    );
  },
  
  updatePassword: async (id, hashedPassword) => {
    await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [hashedPassword, id]);
  },

  // ✅ Add this function
  saveResetToken: async (id, resetToken, resetTokenExpiresAt) => {
    await pool.query(
      "UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE id = ?",
      [resetToken, resetTokenExpiresAt, id]
    );
  },

  // ✅ Also add a method to find user by token
  findByResetToken: async (resetToken) => {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires_at > NOW()",
      [resetToken]
    );
    return rows[0];
  }

};

module.exports = User;
