import Heading from "@/components/Heading";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Wrapper from "@/components/wrapper";
import { cn } from "@/lib/utils";
import { removeFromCart, setCartItems } from "@/redux/reducer/cart";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

const Index = () => {
  //selectors
  const { cartItems, totalQuantity, totalPrice } = useSelector(
    (state) => state.cart,
  );
  const { user } = useSelector((state) => state.auth);

  //initializers
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please login to continue",
        status: "error",
      });
      router.push("/login");
      return;
    }
    // return;
    const res = await fetch("/api/razorpay/order/soft-copy", {
      method: "POST",
      body: JSON.stringify({
        amount: totalPrice,
        quantity: totalQuantity,
        notes: cartItems,
        user: user,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data, "data");
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: data.id,
      amount: data.amount,
      handler: function (response) {
        dispatch(setCartItems({ cart: [], totalPrice: 0, totalQuantity: 0 }));
        router.push("/profile");
        toast({
          title: "Payment Successful",
          description:
            "Your payment has been successfully processed. Please check your email for the receipt.",
        });
      },
      prefill: {
        name: data.notes.user_name,
        email: data.notes.user_email,
      },
      notes: {
        user_id: data.notes.user_id,
        order_id: data.id,
      },
      theme: {
        color: "#F37254",
      },
    };
    const rzp1 = await new window.Razorpay(options);
    rzp1.open();
  };

  console.log(cartItems);
  return (
    <Wrapper>
      <Heading className="pb-0">Cart</Heading>
      <div className="flex flex-col items-center justify-center gap-5 md:flex-row md:items-start">
        {cartItems?.length === 0 && (
          <div className="flex w-full flex-col items-start justify-center gap-5">
            <h1 className="text-center font-sora text-xl font-semibold">
              Your cart is empty 😢
            </h1>
          </div>
        )}
        <div className="grid basis-3/4 grid-cols-1 gap-5 md:grid-cols-2">
          {cartItems?.length > 0 &&
            cartItems?.map((_, i) => {
              return (
                <div
                  key={i}
                  className="flex w-full items-center justify-between gap-5 rounded-xl border bg-slate-50 p-2.5"
                >
                  <div className="flex flex-1 items-center gap-5">
                    <Image
                      src={_.thumbnail}
                      width={100}
                      height={100}
                      alt={_?.chapter_name}
                      className="h-20 w-20 rounded-xl border border-slate-300 object-cover"
                    />
                    <div className="flex-col-start h-full gap-1 py-1">
                      <h1 className="text-sm font-semibold capitalize text-black">
                        {_.chapter_name} - {_.class} - {_.subject_name} -{" "}
                        {_.teacher_name}
                      </h1>
                      <button
                        onClick={() => dispatch(removeFromCart(_.demo_pdf_id))}
                        href="signup"
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "h-auto border bg-white py-1 text-sm",
                        )}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="rounded-xl rounded-b-none border bg-white px-3 py-1.5 text-xs font-medium">
                      Quantity:{" "}
                      <span className="font-semibold">{_.quantity}</span>
                    </div>
                    <div className="rounded-xl rounded-t-none border border-t-0 bg-white px-3 py-1.5 text-xs font-medium">
                      Price: <span className="font-semibold">{_.price}</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        {cartItems?.length > 0 && (
          <div className="flex-col-start w-full basis-full gap-5 md:basis-1/4">
            <div className="flex w-full flex-col items-start gap-5 rounded-2xl border bg-slate-50 p-5">
              <h1 className="font-sora text-2xl font-bold capitalize text-black">
                Summary
              </h1>
              <div className="flex w-full flex-col text-left">
                <div className="flex justify-between rounded-xl rounded-b-none border bg-white px-4 py-2 text-sm font-medium">
                  <span>Total Quantity: </span>
                  <span className="font-semibold">{totalQuantity}</span>
                </div>
                <div className="flex justify-between rounded-xl rounded-b-none rounded-t-none border border-t-0 bg-white px-4 py-2 text-sm font-medium">
                  <span>Sub Total:</span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between rounded-xl rounded-t-none border border-t-0 bg-white px-4 py-2 text-sm font-medium">
                  <span>Total:</span>{" "}
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
              </div>
              <button
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-auto w-full rounded-xl border bg-green-600 px-4 py-4 text-sm font-medium text-white hover:bg-green-700",
                )}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Index;
