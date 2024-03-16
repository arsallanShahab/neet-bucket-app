import Heading from "@/components/Heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Wrapper from "@/components/wrapper";
import { Button, Input as NextUiInput } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const BuyHardCopy = () => {
  const { user } = useSelector((state) => state.auth);
  const { hardCopyItem } = useSelector((state) => state.cart);

  const [email, setEmail] = React.useState(user?.email || "");
  const [firstName, setFirstName] = React.useState(user?.name || "");
  const [lastName, setLastName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [alternatePhone, setAlternatePhone] = React.useState("");
  const [pincode, setPincode] = React.useState("");
  const [coupon, setCoupon] = React.useState("");
  const [isCouponApplied, setIsCouponApplied] = React.useState(false);
  const [price, setPrice] = React.useState(hardCopyItem?.fields?.price || 0);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (
      hardCopyItem === null ||
      hardCopyItem === "undefined" ||
      !hardCopyItem ||
      hardCopyItem.length === 0
    ) {
      router.push("/");
    }
  }, [hardCopyItem, router]);
  let thumbnail_url = hardCopyItem?.fields?.chapterThumbnail?.fields?.file?.url;

  if (thumbnail_url?.startsWith("//images.ctfassets.net/")) {
    thumbnail_url = "https:" + thumbnail_url;
  }

  const handleCheckCoupon = async () => {
    if (!user) {
      toast({
        title: "Please login to continue",
        status: "error",
      });
      router.push("/login");
      return;
    }
    if (!coupon) {
      toast({
        title: "Please enter a coupon code",
      });
      return;
    }
    //check the coupon code
    try {
      const res = await fetch("/api/coupon/check", {
        method: "POST",
        body: JSON.stringify({
          code: coupon,
          user: user.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.discount) {
        setPrice(price - (data.discount / 100) * price);
        setIsCouponApplied(true);
        toast({
          title: "Coupon code applied successfully",
          status: "success",
        });
      } else {
        toast({
          title: "Invalid coupon code",
          status: "error",
        });
      }

      console.log(data, "data");
    } catch (error) {
      toast({
        title: "Invalid coupon code",
        status: "error",
      });
    }
  };

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
          amount: price,
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
          coupon: isCouponApplied ? coupon : "",
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
      <div className="grid w-full gap-5 rounded-xl border bg-zinc-50 px-5 py-5 shadow-sm sm:grid-cols-2 sm:gap-10 sm:px-10">
        <div className="grid">
          <div className="grid gap-5 border-b pb-5 pt-10">
            <h4 className="text-xl font-medium">Contact Information</h4>
            <NextUiInput
              label="Email Address"
              placeholder="Enter your email address"
              labelPlacement="outside"
              value={email}
              onValueChange={setEmail}
              variant="bordered"
              radius="sm"
            />
          </div>
          <div className="grid gap-5 py-5">
            <h4 className="text-xl font-medium">Shipping Information</h4>
            <NextUiInput
              label="First Name"
              placeholder="Enter your first name"
              labelPlacement="outside"
              value={firstName}
              onValueChange={setFirstName}
              variant="bordered"
              radius="sm"
            />
            <NextUiInput
              label="Last Name"
              placeholder="Enter your last name"
              labelPlacement="outside"
              value={lastName}
              onValueChange={setLastName}
              variant="bordered"
              radius="sm"
            />
            <NextUiInput
              label="Phone Number"
              placeholder="Enter your phone number"
              labelPlacement="outside"
              value={phone}
              onValueChange={setPhone}
              variant="bordered"
              radius="sm"
            />
            {/* <NextUiInput
              label="Alternate Phone Number"
              placeholder="Enter your alternate phone number"
              labelPlacement="outside"
              value={alternatePhone}
              onValueChange={setAlternatePhone}
              variant="bordered"
              radius="sm"
            /> */}
            <NextUiInput
              label="Address"
              placeholder="Enter your address"
              labelPlacement="outside"
              value={address}
              onValueChange={setAddress}
              variant="bordered"
              radius="sm"
            />
            <NextUiInput
              label="City"
              placeholder="Enter your city"
              labelPlacement="outside"
              value={city}
              onValueChange={setCity}
              variant="bordered"
              radius="sm"
            />
            <NextUiInput
              label="State"
              placeholder="Enter your state"
              labelPlacement="outside"
              value={state}
              onValueChange={setState}
              variant="bordered"
              radius="sm"
            />
            <NextUiInput
              label="Zip / Postal Code"
              placeholder="Enter your zip / postal code"
              labelPlacement="outside"
              value={pincode}
              onValueChange={setPincode}
              variant="bordered"
              radius="sm"
            />
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
                    Price: ₹{price}
                  </h4>
                  <h4 className="text-sm font-medium text-zinc-700">
                    Quantity: 1
                  </h4>
                </div>
              </div>
            </div>
            <NextUiInput
              label="Coupon Code"
              placeholder="Enter your coupon code"
              labelPlacement="outside"
              value={coupon}
              onValueChange={setCoupon}
              variant="bordered"
              radius="sm"
              endContent={<Label onClick={handleCheckCoupon}>Apply</Label>}
            />
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
