import express from "express";
import { logout, sendOtp, verifyOtp } from "../controllers/authController.js";
import { updateUserName } from "../controllers/nameController.js";
import { getUserProfile, updateUserProfile } from "../controllers/profileController.js";
import upload from "../configs/multer.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/update-name", updateUserName);
router.post("/update", upload.single("profile_img"), updateUserProfile);// Update or Create Profile
router.get("/:user_id", getUserProfile);
router.post("/logout", logout);

export default router;
