import db from "../configs/db.js";

export const updateUserProfile = (req, res) => {
  const { 
    user_id, name, language, address, whatsapp_no, phone_no, dob, 
    pashupalan_years, banimall_usage, animal_usage, education 
  } = req.body;

  const profile_img = req.file ? req.file.path : null; // Cloudinary image URL

  // Check for required fields
  if (!user_id || !name || !pashupalan_years || !banimall_usage || !animal_usage || !education) {
    return res.status(200).json({ message: "Required fields are missing", success: false });
  }

  console.log("Received dob:", dob); // Debugging: Check dob value

  const checkQuery = `SELECT * FROM users WHERE id = ?`;

  db.query(checkQuery, [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length > 0) {
      // 🔹 Update existing user profile
      const sql = `
        UPDATE users 
        SET name = ?, language = ?, address = ?, whatsapp_no = ?, phone_no = ?, 
            pashupalan_years = ?, banimall_usage = ?, animal_usage = ?, education = ?, 
            dob = ?, profile_img = COALESCE(?, profile_img) 
        WHERE id = ?
      `;

      db.query(sql, [
        name, language, address, whatsapp_no, phone_no, pashupalan_years, 
        banimall_usage, animal_usage, education, dob, profile_img, user_id
      ], (err) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        // Fetch updated profile with all fields
        db.query(
          "SELECT *, DATE_FORMAT(dob, '%Y-%m-%d') AS dob FROM users WHERE id = ?", 
          [user_id], 
          (err, userProfile) => {
            if (err) return res.status(500).json({ message: "Error fetching updated profile", error: err });

            return res.status(200).json({
              message: "Profile updated successfully",
              success: true,
              userProfile: userProfile[0] // Return all user details
            });
        });
      });

    } else {
      // 🔹 Insert new user profile
      const sql = `
        INSERT INTO users (id, name, language, address, whatsapp_no, phone_no, dob, 
          pashupalan_years, banimall_usage, animal_usage, education, profile_img)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(sql, [
        user_id, name, language, address, whatsapp_no, phone_no, dob, 
        pashupalan_years, banimall_usage, animal_usage, education, profile_img
      ], (err) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        // Fetch new profile with all fields
        db.query(
          "SELECT *, DATE_FORMAT(dob, '%Y-%m-%d') AS dob FROM users WHERE id = ?", 
          [user_id], 
          (err, userProfile) => {
            if (err) return res.status(500).json({ message: "Error fetching new profile", error: err });

            return res.status(200).json({
              message: "Profile created successfully",
              success: true,
              userProfile: userProfile[0] // Return all user details
            });
        });
      });
    }
  });
};


// 📌 Fetch User Profile with Image
export const getUserProfile = (req, res) => {
  const { user_id } = req.params;

  db.query("SELECT * FROM users WHERE id = ?", [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length === 0) {
      return res.status(200).json({ message: "User profile not found", success: false });
    }

    res.status(200).json({ profile: results[0], success: true });
  });
};
