import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
  const { otp, email } = req.body;
  console.log(otp, email);

  try {
    const { db } = await connectToDatabase();
    const getOtp = await db.collection("otps").findOne({ email: email });
    console.log(getOtp);
    if (getOtp) {
      const { otp: otpCode, otpExpiry } = getOtp;
      console.log(otpCode, otpExpiry, Date.now());
      if (otpCode == otp && otpExpiry > Date.now()) {
        res.status(200).json({ success: true, message: "OTP verified" });
      } else {
        res.status(400).json({ success: false, message: "OTP expired" });
      }
    } else {
      res.status(400).json({ success: false, message: "OTP not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}
