// src/pages/api/createOrder.js
// const razorpay = require("@/lib/razorpay");
import { connectToDatabase } from "@/lib/mongodb";
import { ORDER_TYPE } from "@/lib/utils";
import Razorpay from "razorpay";

const generateReceiptId = () => {
  const result = [];
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength)),
    );
  }
  return result.join("");
};

export default async function handler(req, res) {
  const { amount, quantity, notes: userNotes, user } = req.body;
  const options = {
    amount: amount * 100, // amount in smallest currency unit
    currency: "INR",
    receipt: "RECEIPT_#" + generateReceiptId(),
    notes: {
      user_id: user.id,
      user_email: user.email,
      user_name: user.name,
      total_quantity: quantity,
    },
  };
  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
  });

  try {
    const { db } = await connectToDatabase();
    const response = await razorpay.orders.create(options);
    const order = {
      amount: response.amount / 100,
      currency: response.currency,
      order_id: response.id,
      notes: userNotes,
      receipt: response.receipt,
      user_id: user.id,
      user_email: user.email,
      user_name: user.name,
      total_quantity: quantity,
      order_type: ORDER_TYPE.SOFT_COPY,
      payment_status: "pending",
      created_at: new Date(),
    };
    console.log(response, "response");
    const orderRes = await db.collection("orders").insertOne(order);
    res.status(200).json(response);
  } catch (error) {
    console.log(error, "error");
    res.status(500).send(error);
  }
}
