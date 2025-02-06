import db from "../configs/db.js";

export const updateUserName = (req, res) => {
  const { mobile, name } = req.body;

  if (!mobile || !name) {
    return res.status(200).json({ message: "Mobile number and name are required",success:false });
  }

  db.query("SELECT * FROM users WHERE mobile = ?", [mobile], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length === 0) {
      return res.status(200).json({ message: "Mobile number not found in the database",success:false });
    }

    db.query(
      "UPDATE users SET name = ?, is_register = 1 WHERE mobile = ?",
      [name, mobile],
      (updateErr) => {
        if (updateErr) return res.status(500).json({ message: "Database update error", error: updateErr });

        res.status(200).json({ message: "Name updated successfully", success: true, is_register: 1 });
      }
    );
  });
};
