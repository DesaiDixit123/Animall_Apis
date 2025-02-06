import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import otpRoutes from "./routes/authRoutes.js";
import db from "./configs/db.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/otp", otpRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
