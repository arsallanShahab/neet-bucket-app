import Heading from "@/components/Heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Wrapper from "@/components/wrapper";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";

const BuyHardCopy = () => {
  const { user } = useSelector((state) => state.auth);
  const { hardCopyItem } = useSelector((state) => state.cart);

  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [pincode, setPincode] = React.useState("");

  const { toast } = useToast();

  const router = useRouter();
  console.log(hardCopyItem, "hardCopyItems");
  if (
    hardCopyItem === null ||
    hardCopyItem === "undefined" ||
    !hardCopyItem ||
    hardCopyItem.length === 0
  ) {
    router.push("/hard-copy");
  }
  let thumbnail_url = hardCopyItem?.fields?.chapterThumbnail?.fields?.file?.url;

  if (thumbnail_url.startsWith("//images.ctfassets.net/")) {
    thumbnail_url = "https:" + thumbnail_url;
  }

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Please login to continue",
        status: "error",
      });
      router.push("/login");
      return;
    }
    //validate all the fields
    if (
      !email ||
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !state ||
      !phone ||
      !pincode
    ) {
      toast({
        title: "Please fill all the fields",
        status: "error",
      });
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      toast({
        title: "Please enter a valid email",
      });
      return;
    }
    if (phone.length !== 10) {
      toast({
        title: "Please enter a valid phone number",
      });
      return;
    }
    if (pincode.length !== 6) {
      toast({
        title: "Please enter a valid pincode",
      });
      return;
    }
    if (isNaN(pincode)) {
      toast({
        title: "Please enter a valid pincode",
      });
      return;
    }
    if (isNaN(phone)) {
      toast({
        title: "Please enter a valid phone number",
      });
      return;
    }
    try {
      const res = await fetch("/api/razorpay/order/hard-copy", {
        method: "POST",
        body: JSON.stringify({
          amount: hardCopyItem?.fields?.price,
          quantity: 1,
          notes: hardCopyItem,
          user: {
            id: user.id,
            email,
            name: firstName + " " + lastName,
            address,
            city,
            state,
            phone,
            pincode,
          },
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
          router.push("/profile");
          toast({
            title: "Payment Successful",
            description:
              "Your payment has been successfully processed. Please check your email for the receipt.",
          });
        },
        prefill: {
          name: firstName + " " + lastName,
          email: email,
        },
        notes: {
          user_id: data.notes.user_id,
          order_id: data.id,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log(error);
      toast({
        title: "Payment Failed",
        description: "Your payment has been failed. Please try again.",
      });
    }
  };
  return (
    <Wrapper>
      <Heading>{hardCopyItem?.fields?.heading}</Heading>
      <div className="grid w-full grid-cols-2 gap-10 rounded-xl border bg-zinc-50 px-10 py-5 shadow-sm">
        <div className="grid">
          <div className="grid gap-5 border-b py-10">
            <h4 className="text-xl font-medium">Contact Information</h4>
            <div className="flex w-full flex-col items-start gap-2.5">
              <Label>Email Address</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abc@gmail.com"
                className="w-full shadow-sm"
              />
            </div>
          </div>
          <div className="grid gap-5 py-10">
            <h4 className="text-xl font-medium">Shipping Information</h4>
            <div className="flex w-full flex-col items-start gap-2.5">
              <Label>First Name</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full shadow-sm"
              />
            </div>
            <div className="flex w-full flex-col items-start gap-2.5">
              <Label>Last Name</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full shadow-sm"
              />
            </div>
            <div className="flex w-full flex-col items-start gap-2.5">
              <Label>Address</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full shadow-sm"
              />
            </div>
            <div className="flex w-full flex-col items-start gap-2.5">
              <Label>City</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full shadow-sm"
              />
            </div>
            <div className="flex w-full flex-col items-start gap-2.5">
              <Label>State</Label>
              <Input
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full shadow-sm"
              />
            </div>
            <div className="flex w-full flex-col items-start gap-2.5">
              <Label>Zip / Postal Code</Label>
              <Input
                type="number"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full shadow-sm"
              />
            </div>
            <div className="flex w-full flex-col items-start gap-2.5">
              <Label>Phone Number</Label>
              <Input
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full shadow-sm"
              />
            </div>
          </div>
        </div>
        <div>
          <div className="grid gap-5 py-10">
            <h4 className="text-xl font-medium">Order Summary</h4>
            <div className="flex gap-2.5">
              <Image
                src={thumbnail_url}
                width={100}
                height={100}
                alt={hardCopyItem?.fields?.heading}
                className="aspect-square rounded-lg object-cover"
              />
              <div className="flex flex-col gap-1 py-1">
                <h4 className="text-sm font-medium text-zinc-700">
                  {hardCopyItem?.fields?.heading}
                </h4>
                <h4 className="text-sm font-medium text-zinc-700">
                  {hardCopyItem?.fields?.author}
                </h4>
                <div className="flex gap-2.5">
                  <h4 className="text-sm font-medium text-zinc-700">
                    Price: ₹{hardCopyItem?.fields?.price}
                  </h4>
                  <h4 className="text-sm font-medium text-zinc-700">
                    Quantity: 1
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-5">
            <button
              onClick={handleSubmit}
              className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default BuyHardCopy;
