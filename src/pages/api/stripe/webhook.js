import { connectToDatabase } from "@/lib/mongodb";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }
  let event;
  try {
    const body = await buffer(req);
    const signature = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    console.log(event, "event", event.type, "event type");
  } catch (error) {
    console.log(error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = await stripe.checkout.sessions.retrieve(
        event.data.object.id,
        {
          expand: ["line_items.data.price.product"],
        },
      );
      // const paymentIntent = await stripe.paymentIntents.retrieve(
      //     session.payment_intent,
      // );
      const line_items = session.line_items.data;
      const fullPdfIds = line_items.map((item) => {
        return item.price.product.metadata.fullPdfId;
      });

      const order_item = line_items.map((item) => {
        return {
          chapter_id: item.price.product.metadata.chapter_id,
          chapter_name: item.price.product.name,
          image: item.price.product.images[0],
          price: item.price.unit_amount / 100,
          quantity: item.quantity,
          fullPdfId: item.price.product.metadata.fullPdfId,
        };
      });
      console.log(session, "session");
      const { db } = await connectToDatabase();
      const userOrders = await db
        .collection("users_orders")
        .findOne({ user_id: session.client_reference_id });
      if (userOrders) {
        const res = await db.collection("users_orders").updateOne(
          { user_id: session.client_reference_id },
          {
            $push: {
              orders: [...fullPdfIds],
            },
          },
        );
        console.log(res, "res");
      } else {
        const res = await db.collection("users_orders").insertOne({
          user_id: session.client_reference_id,
          orders: [...fullPdfIds],
        });
        console.log(res, "res");
      }

      const collection = await db.collection("orders");
      const result = await collection.insertOne({
        session_id: session.id,
        order: order_item,
        payment_status: session.payment_status,
        // payment_intent: session.payment_intent,
        // payment_method_types: session.payment_method_types,
        // payment_method: session.payment_method,
        // mode: session.mode,
        order_mode: session.metadata.order_mode,
        // customer: session.customer,
        // client_reference_id: session.client_reference_id,
        // billing_address_collection: session.billing_address_collection,
        // shipping_address_collection: session.shipping_address_collection,
        // shipping: session.shipping,
        // locale: session.locale,
        // livemode: session.livemode,
        currency: session.currency,
        amount_total: session.amount_total,
        amount_subtotal: session.amount_subtotal,
        // allow_promotion_codes: session.allow_promotion_codes,
        // discounts: session.discounts,
        created: session.created,
        payment_status: session.payment_status,
        status: session.status,
        customer_email: session.customer_details.email,
        customer_name: session.customer_details.name,
        total_details: session.total_details,
        user_id: session.client_reference_id,
      });

      console.log(result, "result");
      return res.status(200).json({ received: true });

    default:
      console.log("Unhandled event type");
      return res.status(400).json({ message: "Unhandled event type" });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const buffer = (req) => {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    req.on("error", reject);
  });
};
