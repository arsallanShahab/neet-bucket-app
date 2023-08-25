import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { setAppLoading, setAppSuccess } from "@/redux/reducer/app";
import { setOrders } from "@/redux/reducer/orders";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Index = () => {
  const { user } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);
  const [isLoading, setIsLoading] = useState(false);
  // handlers
  const handleDownload = (url, name) => async () => {
    const link = document.createElement("a");
    link.href = url;
    console.log(link, "link");
    link.download = `${name}-full.pdf`;
    link.target = "_blank";
    link.click();
  };

  //initializers
  const dispatch = useDispatch();
  const router = useRouter();

  // useEffect
  useEffect(() => {
    const fetchOrders = async (id) => {
      setIsLoading(true);
      const res = await fetch("/api/user/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const { user_orders, success } = await res.json();

      if (success) {
        //reverse the order of the orders
        const reversedOrders = user_orders.orders.reverse();
        dispatch(setOrders(reversedOrders));
      }
      setIsLoading(false);
      // console.log(orders, "orders");
    };
    if (user) {
      fetchOrders(user.id);
    }
  }, [user]);

  return (
    <div className="p-5 sm:p-10">
      <Heading>My Orders</Heading>
      <div className="flex w-full flex-col items-start justify-start gap-5">
        {isLoading && (
          <div className="flex h-96 w-full flex-col items-center justify-center gap-5">
            <p className="text-2xl font-semibold text-slate-950">Loading...</p>
          </div>
        )}
        {orders.length === 0 && (
          <div className="flex h-96 w-full flex-col items-center justify-center gap-5">
            <p className="text-2xl font-semibold text-slate-950">
              You have no orders yet
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-1/2"
            >
              Continue Shopping
            </Button>
          </div>
        )}
        {orders &&
          orders.map((item, i) => {
            const order_type = item.order_type;
            const { order_items } = item;
            return (
              <div key={i} className="flex w-full flex-col rounded-xl border">
                <div className="flex flex-col flex-wrap border-b sm:flex-row ">
                  {/* <p className="font-sora text-2xl font-bold capitalize text-slate-950 ">
                  Order #{item.id}
                </p> */}
                  <div className="border-r p-3 pl-4">
                    <span className="mr-1 text-xs font-semibold text-slate-500">
                      ordered on:
                    </span>
                    <span className="text-xs font-semibold text-slate-950">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="border-r p-3">
                    <span className="mr-1 text-xs font-semibold text-slate-500">
                      order status:
                    </span>
                    <span className="text-xs font-semibold text-slate-950">
                      {item.status}
                    </span>
                  </div>
                  <div className="mr-1 border-r p-3">
                    <span className="text-xs font-semibold text-slate-500">
                      total:
                    </span>
                    <span className="text-xs font-semibold text-slate-950">
                      ₹{item.total_price}
                    </span>
                  </div>
                  <div className="border-r p-3">
                    <span className="mr-1 text-xs font-semibold text-slate-500">
                      order by:
                    </span>
                    <span className="text-xs font-semibold text-slate-950">
                      {item.customer_name}
                    </span>
                  </div>
                </div>
                <div>
                  {order_items.map((order, i) => {
                    console.log(order);
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center justify-between gap-2.5 border-b p-3 last:border-b-0 sm:flex-row sm:gap-0"
                      >
                        <div className="flex w-full flex-row items-center justify-start gap-5 sm:w-auto sm:flex-row">
                          <Image
                            src={order.thumbnail}
                            alt={order.chapter_name}
                            width={50}
                            height={50}
                            className="h-14 w-14 rounded border object-cover"
                          />
                          <div className="flex flex-col">
                            <p className="text-sm capitalize text-slate-950 ">
                              {order_type == "hardcopy"
                                ? order.name
                                : order.chapter_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex w-full flex-col items-center justify-between gap-5 sm:w-auto sm:flex-row">
                          <p className="hidden text-sm capitalize text-slate-950 sm:flex ">
                            ₹{order.price}
                          </p>
                          <p className="k hidden text-sm capitalize text-slate-950 sm:inline-block ">
                            {order.quantity}
                          </p>
                          {order.full_pdf && (
                            <Button
                              variant={"outline"}
                              onClick={handleDownload(
                                order.full_pdf.url,
                                order.chapter_name,
                              )}
                              className="h-auto w-full flex-col sm:w-auto"
                            >
                              Download PDF{" "}
                              <span className="text-xs text-slate-500">
                                {order.full_pdf.fileSize}
                              </span>
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Index;
