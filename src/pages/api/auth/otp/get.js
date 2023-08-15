import { connectToDatabase } from "@/lib/mongodb";
import nodemailer from "nodemailer";

const OTP_EXPIRY_DURATION = 5 * 60 * 1000; // 5 minutes

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
};

export default async function handler(req, res) {
  const { email } = req.body;

  //generate otp
  const otp = generateOTP();
  const timestamp = Date.now();
  const expiry = timestamp + OTP_EXPIRY_DURATION;

  //save otp and expiry in db
  const { db } = await connectToDatabase();

  //check if user exists
  const isExistingUser = await db.collection("users").findOne({ email });
  if (isExistingUser) {
    // await db.collection("users").updateOne({email}, {$set: {otp, otpExpiry: expiry}});
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }
  //delete existing otp if any
  const deleteOtps = await db.collection("otps").deleteMany({ email });

  //save otp and expiry in db
  const saveOtp = await db
    .collection("otps")
    .insertOne({ email, otp, otpExpiry: expiry });

  //send thorugh smtp
  const transporter = nodemailer.createTransport({
    port: process.env.NODEMAILER_SMTP_PORT,
    host: process.env.NODEMAILER_SMTP_HOST,
    auth: {
      user: process.env.NODEMAILER_EMAIL_USER,
      pass: process.env.NODEMAILER_EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: `"${process.env.NODEMAILER_EMAIL_NAME}" <${process.env.NODEMAILER_EMAIL_USER}>`,
    to: email,
    subject: "OTP for login",
    text: `Your OTP for email verification is: ${otp}`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Error in sending otp" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ success: true, message: "OTP sent " });
    }
  });
}
