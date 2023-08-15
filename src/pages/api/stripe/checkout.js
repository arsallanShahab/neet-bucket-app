import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY,
  // , {
  //   apiVersion: "2020-08-27",
  // }
);

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
            name: item.chapter_name,
            images: [item.thumbnail],
            metadata: {
              chapter_id: item.demo_pdf_id,
              full_pdf_url: item.full_pdf.url,
              full_pdf_size: item.full_pdf.fileSize,
            },
          },

          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      client_reference_id: user_id,
      metadata: {
        order_mode: "softcopy",
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
