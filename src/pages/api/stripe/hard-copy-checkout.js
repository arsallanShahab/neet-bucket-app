import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { cartItems, totalQuantity, totalPrice, user_id } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems.map((item) => ({
        //add meta data
        price_data: {
          currency: "inr",
          product_data: {
            name: item.heading,
            images: [item.thumbnail],
            metadata: {
              id: item.id,
            },
          },

          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      phone_number_collection: {
        enabled: true,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "inr",
            },
            display_name: "Standard shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 7000,
              currency: "inr",
            },
            display_name: "Express shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 4,
              },
              maximum: {
                unit: "business_day",
                value: 5,
              },
            },
          },
        },
      ],
      client_reference_id: user_id,
      metadata: {
        order_mode: "hardcopy",
        total_quantity: totalQuantity,
        total_price: totalPrice,
      },

      mode: "payment",
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cart`,
    });
    res.status(200).json({ id: session.id, url: session.url, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }

  // res.status(200).json({ message: "success" });
}
