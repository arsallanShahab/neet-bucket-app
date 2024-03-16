import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { code, user } = req.body;
    const { db } = await connectToDatabase();
    const coupon = await db.collection("coupons").findOne({ coupon: code });
    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }
    const isAlreadyUsed = coupon?.user?.find((u) => u === user);
    if (isAlreadyUsed) {
      return res
        .status(400)
        .json({ message: "You have already used this coupon" });
    }
    return res.status(200).json(coupon);
  }
}
