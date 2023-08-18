import Heading from "@/components/Heading";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { removeFromCart } from "@/redux/reducer/cart";
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

  //handlers
  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please login to continue",
        status: "error",
      });
      router.push("/login");
      return;
    }
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({
        cartItems,
        totalQuantity,
        totalPrice,
        user_id: user.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { url, success, id } = await res.json();
    console.log(url, success, id);
    if (success) {
      router.push(url);
    }
  };
  console.log(cartItems);
  return (
    <div className="p-5 md:p-10">
      <Heading>Cart</Heading>
      <div className="flex flex-col items-center justify-center gap-5 md:flex-row md:items-start">
        <div className="grid basis-3/4 grid-cols-1 gap-5 md:grid-cols-2">
          {cartItems.map((_, i) => {
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
      </div>
    </div>
  );
};

export default Index;
