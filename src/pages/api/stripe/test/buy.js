import { PROFILE_TABS } from "@/lib/CONST";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { test_id, user_id, test_name, test_desc } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: test_name,
              description: test_desc,
            },
            unit_amount: 75 * 100,
          },
          quantity: 1,
        },
      ],
      client_reference_id: user_id,
      metadata: {
        test_id,
        order_mode: "testseries",
      },
      mode: "payment",
      success_url: `${req.headers.origin}/profile?success=true&tab=${PROFILE_TABS.TestSeries}`,
      cancel_url: `${req.headers.origin}/profile`,
    });
    res.status(200).json({ id: session.id, url: session.url, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }

  // res.status(200).json({ message: "success" });
}
