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
      try {
        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          {
            expand: ["line_items.data.price.product"],
          },
        );
        const line_items = session.line_items.data;

        console.log(line_items, "line_items");

        const order_items = line_items.map((item) => {
          return {
            chapter_id: item.price.product.metadata.chapter_id,
            chapter_name: item.price.product.name,
            thumbnail: item.price.product.images[0],
            price: item.price.unit_amount / 100,
            quantity: item.quantity,
            full_pdf: {
              url: item.price.product.metadata.full_pdf_url,
              fileSize: item.price.product.metadata.full_pdf_size,
            },
          };
        });
        // console.log(session, "session");
        const { db } = await connectToDatabase();
        const order_item = {
          order_items,
          total_quantity: session.metadata.total_quantity,
          total_price: session.metadata.total_price,
          payment_status: session.payment_status,
          status: "completed",
          session_id: session.id,
          created_at: new Date(),
          customer_email: session.customer_details.email,
          customer_name: session.customer_details.name,
          order_type: session.metadata.order_mode,
          currency: session.currency,
        };

        const findUserOrder = await db.collection("orders").findOne({
          user_id: session.client_reference_id,
        });

        console.log(findUserOrder, "findUserOrder");

        if (findUserOrder) {
          const res = await db.collection("orders").updateOne(
            { user_id: session.client_reference_id },
            {
              $push: {
                orders: order_item,
              },
            },
          );
          console.log(res, "res");
        } else {
          const res = await db.collection("orders").insertOne({
            user_id: session.client_reference_id,
            orders: [order_item],
          });
          console.log(res, "res");
        }

        return res.status(200).json({ received: true });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Internal server error" });
      }

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
