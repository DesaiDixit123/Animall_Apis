import db from "../configs/db.js";
export const sendOtp = (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(200).json({ message: "Mobile number is required", success: false });

  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 5);

  db.query("SELECT * FROM users WHERE mobile = ?", [mobile], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    // Check if the name is present or blank to set is_register value
    let isRegister = 0;
    if (results.length > 0) {
      const user = results[0];
      if (user.name && user.name.trim() !== "") {
        isRegister = 1; // If name is present, set is_register to 1
      }
    }

    db.query(
      "INSERT INTO users (mobile, otp, otp_expiry, is_register) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE otp=?, otp_expiry=?, is_register=?",
      [mobile, otp, expiryTime, isRegister, otp, expiryTime, isRegister],
      (err) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        console.log(`✅ OTP for ${mobile}: ${otp}`);
        res.status(200).json({ message: "OTP generated successfully", otp, success: true, is_register: isRegister });
      }
    );
  });
};

export const verifyOtp = (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) return res.status(200).json({ message: "Mobile and OTP are required", success: false });

  db.query("SELECT id, name, mobile, otp, otp_expiry FROM users WHERE mobile = ?", [mobile], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(200).json({ message: "Mobile number not found", success: false });

    const user = results[0];
    if (user.otp !== otp) return res.status(200).json({ message: "Invalid OTP", success: false });

    const now = new Date();
    if (new Date(user.otp_expiry) < now) return res.status(200).json({ message: "OTP expired", success: false });

    // **Check if name is blank or not and set is_register accordingly**
    let isRegister = 0;
    if (user.name && user.name.trim() !== "") {
      isRegister = 1; // If name is present, set is_register to 1
    }

    // Return only required user fields and is_register value
    res.status(200).json({
      message: "OTP verified successfully",
      success: true,
      is_register: isRegister,
      user: { id: user.id, name: user.name, mobile: user.mobile } // Only send name, id, and mobile
    });
  });
};
