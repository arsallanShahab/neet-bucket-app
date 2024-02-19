import { connectToDatabase } from "@/lib/mongodb";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

export async function POST(request) {
  try {
    const text = await request.text();
    const signature = request.headers.get("X-Razorpay-Signature");
    validateWebhookSignature(
      JSON.stringify(text),
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );

    const payment = JSON.parse(text);
    if (payment.event !== "payment.captured") {
      return new Response("Success! webhook working", {
        status: 200,
      });
    }

    const entity = payment.payload.payment.entity;
    const { db } = await connectToDatabase();
    const order = await db
      .collection("orders")
      .findOne({ order_id: entity.order_id });
    if (order) {
      await db
        .collection("orders")
        .updateOne(
          { order_id: entity.order_id },
          { $set: { payment_status: "paid" } },
        );
    } else {
      return new Response(
        JSON.stringify({
          message: "Order not found",
        }),
        {
          status: 404,
        },
      );
    }
    return new Response(
      JSON.stringify({
        message: "Payment captured",
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }
}

export async function GET(request) {
  return new Response("Success! webhook working", {
    status: 200,
  });
}
