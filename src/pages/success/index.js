import Heading from "@/components/Heading";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = () => {
  const router = useRouter();
  const { session_id } = router.query;

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch("/api/stripe/session", {
        method: "POST",
        body: JSON.stringify({ session_id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { success, paymentIntent, session } = await res.json();
      const { status } = paymentIntent;
      console.log(success, paymentIntent, status);
      if (success && status === "succeeded") {
        router.push("/orders");
      }
    };
    if (session_id) {
      fetchSession();
    }
  }, [session_id]);

  return (
    <div className="p-10">
      <Heading>Success</Heading>
    </div>
  );
};

export default Index;
