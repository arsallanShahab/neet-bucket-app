import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
  let { otp, email } = req.body;
  if (typeof otp === "string") {
    otp = parseInt(otp);
  }

  try {
    const { db } = await connectToDatabase();
    const getOtp = await db.collection("otps").findOne({ email, otp });
    console.log(getOtp);
    if (getOtp) {
      const { otp: otpCode, expiry } = getOtp;
      console.log(otpCode, expiry, Date.now());
      if (otpCode == otp && expiry > Date.now()) {
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
