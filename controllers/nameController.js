import db from "../configs/db.js";

// export const updateUserName = (req, res) => {
//   const { mobile, name } = req.body;

//   if (!mobile || !name) {
//     return res.status(200).json({ message: "Mobile number and name are required", success: false });
//   }

//   db.query("SELECT * FROM users WHERE mobile = ?", [mobile], (err, results) => {
//     if (err) return res.status(500).json({ message: "Database error", error: err });

//     if (results.length === 0) {
//       return res.status(200).json({ message: "Mobile number not found in the database", success: false });
//     }

//     db.query(
//       "UPDATE users SET name = ?, is_register = 1 WHERE mobile = ?",
//       [name, mobile],
//       (updateErr) => {
//         if (updateErr) return res.status(500).json({ message: "Database update error", error: updateErr });

//         // 🔹 Name update successful, now fetch user details
//         db.query(
//           "SELECT id, name, otp, mobile FROM users WHERE mobile = ?",
//           [mobile],
//           (fetchErr, userResults) => {
//             if (fetchErr) return res.status(500).json({ message: "Error fetching user data", error: fetchErr });

//             res.status(200).json({
//               message: "Name updated successfully",
//               success: true,
//               is_register: 1,
//               user: userResults[0] // Return only required fields
//             });
//           }
//         );
//       }
//     );
//   });
// };




export const updateUserName = (req, res) => {
  const { mobile, name } = req.body;

  if (!mobile || !name) {
    return res.status(200).json({ message: "Mobile number and name are required", success: false });
  }

  db.query("SELECT id, name, otp, mobile FROM users WHERE mobile = ?", [mobile], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length === 0) {
      return res.status(200).json({ message: "Mobile number not found in the database", success: false });
    }

    db.query(
      "UPDATE users SET name = ?, is_register = 1 WHERE mobile = ?",
      [name, mobile],
      (updateErr) => {
        if (updateErr) return res.status(500).json({ message: "Database update error", error: updateErr });

        // 🔹 Name update successful, now fetch only required fields
        db.query(
          "SELECT id, name, otp, mobile FROM users WHERE mobile = ?",
          [mobile],
          (fetchErr, userResults) => {
            if (fetchErr) return res.status(500).json({ message: "Error fetching user data", error: fetchErr });

            // 🔹 Ensure only required data is stored
            const userData = {
              id: userResults[0].id,
              name: userResults[0].name,
              mobile: userResults[0].mobile,
              otp: userResults[0].otp
            };

            res.status(200).json({ 
              message: "Name updated successfully", 
              success: true, 
              is_register: 1,
              user: userData // Return only required fields
            });
          }
        );
      }
    );
  });
};
