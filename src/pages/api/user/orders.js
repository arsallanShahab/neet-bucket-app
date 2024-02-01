import { connectToDatabase } from "@/lib/mongodb";
import { groupByProp } from "@/lib/utils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.body;

  try {
    const { db } = await connectToDatabase();
    // reverse the order of the orders
    const orders = await db
      .collection("orders")
      .find({ user_id: id, payment_status: "paid" })
      .toArray();
    console.log(orders, "orders");
    const orderbyGroup = groupByProp(orders, ["order_type"]);
    console.log(orderbyGroup, "orderbyGroup");
    return res.status(200).json({ user_orders: orderbyGroup, success: true });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
}
