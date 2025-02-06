import db from "../configs/db.js";

export const sendOtp = (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(200).json({ message: "Mobile number is required" ,success:false});

  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 5);

  db.query("SELECT * FROM users WHERE mobile = ?", [mobile], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    
    let isRegister = results.length > 0 ? 1 : 0;
    
    db.query(
      "INSERT INTO users (mobile, otp, otp_expiry, is_register) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE otp=?, otp_expiry=?, is_register=?",
      [mobile, otp, expiryTime, isRegister, otp, expiryTime, 1],
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
  if (!mobile || !otp) return res.status(200).json({ message: "Mobile and OTP are required",success:false });

  db.query("SELECT * FROM users WHERE mobile = ?", [mobile], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(200).json({ message: "Mobile number not found" ,success:false});

    const user = results[0];
    if (user.otp !== otp) return res.status(200).json({ message: "Invalid OTP",success:false });

    const now = new Date();
    if (new Date(user.otp_expiry) < now) return res.status(200).json({ message: "OTP expired" ,success:false});

    db.query("UPDATE users SET is_register = 1 WHERE mobile = ?", [mobile], (err) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      
      db.query("SELECT * FROM users WHERE mobile = ?", [mobile], (err, updatedResults) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.status(200).json({ message: "Login successful", is_register: 1, user: updatedResults[0] });
      });
    });
  });
};