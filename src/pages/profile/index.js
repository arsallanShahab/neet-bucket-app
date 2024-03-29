import AppLoader from "@/components/AppLoader";
import Heading from "@/components/Heading";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROFILE_TABS } from "@/lib/CONST";
import { ORDER_TYPE } from "@/lib/utils";
import { setOrders } from "@/redux/reducer/orders";
import { setTests } from "@/redux/reducer/test";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Index = () => {
  // redux
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.app);

  const [isLoading, setIsLoading] = useState(false);
  const [softCopy, setSoftCopy] = useState(null);
  const [hardCopy, setHardCopy] = useState(null);

  const [activeTab, setActiveTab] = useState(null);

  const router = useRouter();
  const params = router.query;
  const { tab } = params;

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/user/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: user.id }),
        });
        const data = await res.json();
        if (data.success) {
          const softcopyOrders = data?.user_orders.filter(
            (order) => order.order_type === ORDER_TYPE.SOFT_COPY,
          )[0];
          const hardcopyOrders = data?.user_orders.filter(
            (order) => order.order_type === ORDER_TYPE.HARD_COPY,
          )[0];
          console.log(data, "data");
          console.log(softcopyOrders, "softcopyOrders");
          console.log(hardcopyOrders, "hardcopyOrders");
          setSoftCopy(softcopyOrders?.data);
          setHardCopy(hardcopyOrders?.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  if (loading || isLoading) {
    return <AppLoader />;
  }

  if (!loading && !user) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 px-5 py-28">
        <p className="text-2xl font-semibold text-slate-950">
          Please login to view your profile
        </p>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => router.push("/login")}
        >
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="p-5 py-16 md:p-10">
      <Heading>My Account</Heading>
      <Tabs
        defaultValue={PROFILE_TABS.Softcopy}
        value={
          tab === PROFILE_TABS.Softcopy ||
          tab === PROFILE_TABS.Hardcopy ||
          // tab === PROFILE_TABS.TestSeries ||
          tab === PROFILE_TABS.Account
            ? tab
            : PROFILE_TABS.Softcopy
        }
        onValueChange={(value) => {
          setActiveTab(value);
          router.push(`/profile?tab=${value}`, undefined, { shallow: true }); // shallow routing
        }}
      >
        <TabsList className="grid w-full grid-cols-3 gap-1 rounded-md sm:max-w-2xl">
          <TabsTrigger
            value={PROFILE_TABS.Softcopy}
            //set tab value to the current tab
            className="rounded-md"
          >
            Soft Copy
          </TabsTrigger>
          <TabsTrigger value={PROFILE_TABS.Hardcopy} className="rounded-md">
            Hard Copy
          </TabsTrigger>
          {/* <TabsTrigger value={PROFILE_TABS.TestSeries} className="rounded-md">
            Test Series
          </TabsTrigger> */}
          <TabsTrigger value={PROFILE_TABS.Account} className="rounded-md">
            Account
          </TabsTrigger>
        </TabsList>
        <TabsContent value={PROFILE_TABS.Softcopy}>
          <Card className="p-5">
            <SoftCopy data={softCopy} />
          </Card>
        </TabsContent>
        <TabsContent value={PROFILE_TABS.Hardcopy}>
          <Card className="p-5">
            <HardCopy data={hardCopy} />
          </Card>
        </TabsContent>
        {/* <TabsContent value={PROFILE_TABS.TestSeries}>
          <Card className="p-5">
            <TestSeries />
          </Card>
        </TabsContent> */}
        <TabsContent value={PROFILE_TABS.Account}>
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you&apos;re
                done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={user.name} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TestSeries = () => {
  const { user } = useSelector((state) => state.auth);
  const { tests } = useSelector((state) => state.tests);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  // useEffect
  useEffect(() => {
    const fetchOrders = async (id) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/user/tests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
        const { user_orders, success } = await res.json();
        if (success) {
          const reversedOrders = user_orders.reverse();
          dispatch(setTests(reversedOrders));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user && !tests) {
      fetchOrders(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  if (isLoading || !user || !tests) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-5">
      {tests?.length === 0 && (
        <div className="flex w-full flex-col items-center justify-center gap-5 px-5 py-28">
          <p className="text-2xl font-semibold text-slate-950">
            You have not purchased any soft copy yet
          </p>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </Button>
        </div>
      )}
      {tests &&
        tests.map((item, i) => {
          console.log(item);
          return (
            <div key={i} className="flex w-full flex-col rounded-xl border">
              <div className="flex flex-col flex-wrap border-b sm:flex-row ">
                <div className="border-r p-3 pl-4">
                  <span className="mr-1 text-xs font-semibold text-slate-500">
                    ordered on:
                  </span>
                  <span className="text-xs font-semibold text-slate-950">
                    {new Date(
                      item?.order_details?.created_at,
                    ).toLocaleDateString("en-US", {
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
                    {item?.payment_details?.payment_status}
                  </span>
                </div>
                <div className="mr-1 border-r p-3">
                  <span className="text-xs font-semibold text-slate-500">
                    total:
                  </span>
                  <span className="text-xs font-semibold text-slate-950">
                    ₹{item?.order_details?.test_price}
                  </span>
                </div>
                <div className="border-r p-3">
                  <span className="mr-1 text-xs font-semibold text-slate-500">
                    order by:
                  </span>
                  <span className="text-xs font-semibold text-slate-950">
                    {item?.payment_details.customer_name}
                  </span>
                </div>
              </div>
              <div
                key={i}
                className="flex flex-col items-center justify-between gap-2.5 border-b p-3 last:border-b-0 sm:flex-row sm:gap-0"
              >
                <div className="flex w-full flex-row items-center justify-start gap-5 sm:w-auto sm:flex-row">
                  <div className="flex flex-col">
                    <p className="text-sm capitalize text-slate-950 ">
                      {item?.order_details?.test_name}
                    </p>
                  </div>
                </div>
                <div className="flex w-full flex-col items-center justify-between gap-5 sm:w-auto sm:flex-row">
                  <p className="hidden text-sm capitalize text-slate-950 sm:flex ">
                    ₹ {item?.order_details?.test_price}
                  </p>
                  {item?.attempted && (
                    <Link
                      href={`/test-series/summary/${item._id}`}
                      variant={"outline"}
                      className="h-auto w-full flex-col rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium hover:bg-gray-200 sm:w-auto"
                    >
                      View Result
                    </Link>
                  )}
                  <Link
                    href={`/test-series/${item?.order_details?.test_name
                      .toLowerCase()
                      .replace(/\s/g, "-")}/${item?.test_id} `}
                    className="h-auto w-full flex-col rounded-lg bg-gray-800 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 sm:w-auto"
                  >
                    {item?.attempted ? "Retake Test" : "Start Test"}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

const SoftCopy = ({ data }) => {
  const router = useRouter();
  const handleDownload = (url, name) => async () => {
    const link = document.createElement("a");
    link.href = url;
    console.log(link, "link");
    link.download = `${name}-full.pdf`;
    link.target = "_blank";
    link.click();
  };
  return (
    <div className="flex flex-col gap-5">
      {(data?.length === 0 || !data) && (
        <div className="flex w-full flex-col items-center justify-center gap-5 px-5 py-28">
          <p className="text-2xl font-semibold text-slate-950">
            You have not purchased any soft copy yet
          </p>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </Button>
        </div>
      )}
      {data?.map((item, i) => {
        console.log(item);
        return (
          <div key={i} className="flex w-full flex-col rounded-lg border">
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
                  {item.payment_status}
                </span>
              </div>
              <div className="mr-1 border-r p-3">
                <span className="text-xs font-semibold text-slate-500">
                  total:
                </span>
                <span className="text-xs font-semibold text-slate-950">
                  ₹{item.amount}
                </span>
              </div>
              <div className="border-r p-3">
                <span className="mr-1 text-xs font-semibold text-slate-500">
                  order by:
                </span>
                <span className="text-xs font-semibold text-slate-950">
                  {item.user_name}
                </span>
              </div>
            </div>
            <div>
              {item?.notes?.map((order, i) => {
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
                          {order.chapter_name}
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
                          <span className="text-xs text-black opacity-60">
                            {Math.floor(parseFloat(order.full_pdf.fileSize))} MB
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
  );
};
const HardCopy = ({ data }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5">
      {(data?.length === 0 || !data) && (
        <div className="flex w-full flex-col items-center justify-center gap-5 px-5 py-28">
          <p className="text-2xl font-semibold text-slate-950">
            You have not purchased any hard copy yet
          </p>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </Button>
        </div>
      )}
      {data?.map((item, i) => {
        console.log(item);
        let thumbnail_url =
          item?.notes?.fields?.chapterThumbnail?.fields?.file?.url;
        if (thumbnail_url.startsWith("//")) {
          thumbnail_url = "https:" + thumbnail_url;
        }
        return (
          <div key={i} className="flex w-full flex-col rounded-lg border">
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
                  {item.payment_status}
                </span>
              </div>
              <div className="mr-1 border-r p-3">
                <span className="text-xs font-semibold text-slate-500">
                  total:
                </span>
                <span className="text-xs font-semibold text-slate-950">
                  ₹{item.amount}
                </span>
              </div>
              <div className="border-r p-3">
                <span className="mr-1 text-xs font-semibold text-slate-500">
                  order by:
                </span>
                <span className="text-xs font-semibold text-slate-950">
                  {item.user_name}
                </span>
              </div>
              <div className="border-r p-3">
                <span className="mr-1 text-xs font-semibold text-slate-500">
                  shipping address:
                </span>
                <span className="max-w-sm text-xs font-semibold text-slate-950">
                  {item.shipping_address.address}
                </span>
              </div>
              <div className="border-r p-3">
                <span className="mr-1 text-xs font-semibold text-slate-500">
                  shipping status:
                </span>
                <span className="max-w-sm text-xs font-semibold text-slate-950">
                  {item.shipping_status}
                </span>
              </div>
            </div>
            <div
              key={i}
              className="flex flex-col items-center justify-between gap-2.5 border-b p-3 last:border-b-0 sm:flex-row sm:gap-0"
            >
              <div className="flex w-full flex-row items-center justify-start gap-5 sm:w-auto sm:flex-row">
                <Image
                  src={thumbnail_url}
                  alt={item.notes?.fields?.Heading}
                  width={50}
                  height={50}
                  className="h-14 w-14 rounded border object-cover"
                />
                <div className="flex flex-col">
                  <p className="text-sm capitalize text-slate-950 ">
                    {item.notes?.fields?.heading}
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-col items-center justify-between gap-5 sm:w-auto sm:flex-row">
                <p className="hidden text-sm capitalize text-slate-950 sm:flex ">
                  ₹{item.amount}
                </p>
                <p className="k hidden text-sm capitalize text-slate-950 sm:inline-block ">
                  {item.quantity}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Index;
