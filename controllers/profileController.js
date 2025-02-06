import db from "../configs/db.js";
export const updateUserProfile = (req, res) => {
  const { 
    user_id, name, language, address, whatsapp_no, phone_no, dob, 
    pashupalan_years, banimall_usage, animal_usage, education 
  } = req.body;

  const profile_img = req.file ? req.file.path : null; // Cloudinary image URL

  if (!user_id || !name || !pashupalan_years || !banimall_usage || !animal_usage || !education) {
    return res.status(200).json({ message: "Required fields are missing" , success:false });
  }

  // Debugging: Check the received dob
  console.log("Received dob:", dob);

  // Query to check if the user already exists with the same phone_no and dob
  const checkQuery = `
    SELECT * FROM users_profiles WHERE user_id = ? AND phone_no = ? AND dob = ?
  `;

  db.query(checkQuery, [user_id, phone_no, dob], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    // If user exists, update their profile
    if (results.length > 0) {
      // Update the existing profile with new data
      const sql = `
        UPDATE users_profiles 
        SET name = ?, language = ?, address = ?, whatsapp_no = ?, phone_no = ?, 
            pashupalan_years = ?, banimall_usage = ?, animal_usage = ?, education = ?, 
            profile_img = COALESCE(?, profile_img) 
        WHERE user_id = ? AND phone_no = ? AND dob = ?
      `;

      db.query(sql, [
        name, language, address, whatsapp_no, phone_no, pashupalan_years, 
        banimall_usage, animal_usage, education, profile_img, 
        user_id, phone_no, dob
      ], (err) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        // Fetch updated user profile
        db.query("SELECT * FROM users_profiles WHERE user_id = ?", [user_id], (err, userProfile) => {
          if (err) return res.status(500).json({ message: "Error fetching updated profile", error: err });

          console.log("Fetched updated user profile:", userProfile);
          return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            userProfile: userProfile[0]
          });
        });
      });

    } else {
      // If user doesn't exist, insert a new profile
      const sql = `
        INSERT INTO users_profiles (user_id, name, language, address, whatsapp_no, phone_no, dob, 
          pashupalan_years, banimall_usage, animal_usage, education, profile_img)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [user_id, name, language, address, whatsapp_no, phone_no, dob, 
          pashupalan_years, banimall_usage, animal_usage, education, profile_img],
        (err) => {
          if (err) return res.status(500).json({ message: "Database error", error: err });

          // Fetch the newly created user profile
          db.query("SELECT * FROM users_profiles WHERE user_id = ?", [user_id], (err, userProfile) => {
            if (err) return res.status(500).json({ message: "Error fetching updated profile", error: err });

            return res.status(200).json({
              message: "Profile created successfully",
              success: true,
              userProfile: userProfile[0]
            });
          });
        }
      );
    }
  });
};

// 📌 Fetch User Profile with Image
export const getUserProfile = (req, res) => {
  const { user_id } = req.params;

  db.query("SELECT * FROM users_profiles WHERE user_id = ?", [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.status(200).json({ profile: results[0], success: true });
  });
};
