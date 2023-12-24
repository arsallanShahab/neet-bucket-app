// src/pages/api/createOrder.js
// const razorpay = require("@/lib/razorpay");
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
  const { amount } = req.body;
  const options = {
    amount: amount * 100, // amount in smallest currency unit
    currency: "INR",
    receipt: "receipt_" + generateReceiptId(),
    payment_capture: 1,
  };

  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
  });

  try {
    const response = await razorpay.orders.create(options);
    res.status(200).json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}
