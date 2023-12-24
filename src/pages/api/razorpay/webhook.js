// src/pages/api/webhook.js
import { connectToDatabase } from "@/lib/mongodb";
import crypto from "crypto";

export default async function handler(req, res) {
  const { body, headers } = req;
  const signature = headers["x-razorpay-signature"];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(body))
    .digest("hex");

  if (generatedSignature === signature) {
    // The request is from Razorpay. You can save the order in your database here.
    console.log("Order saved:", body);
    const { db } = await connectToDatabase();
    db.collection("orders").insertOne(body.payload.payment.entity);
    res.status(200).send("OK");
  } else {
    // The request is not from Razorpay. Do not process it.
    res.status(400).send("Invalid signature");
  }
}
