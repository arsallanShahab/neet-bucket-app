import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.body;

  try {
    const { db } = await connectToDatabase();
    const orders = await db.collection("orders").findOne({ user_id: id });
    res.status(200).json({ user_orders: orders, success: true });
  } catch (error) {}
}
