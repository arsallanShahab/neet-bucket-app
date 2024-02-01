import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

const Heading = ({ children, className }) => {
  const router = useRouter();
  const path = router.pathname.split("/")[1];
  // console.log(router.pathname.split("/")[1]);

  // go back to previous page
  const goBack = () => {
    router.back();
  };
  return (
    <div className="flex w-full flex-col items-start justify-start">
      <button
        onClick={goBack}
        className="flex -translate-x-3 items-center justify-start rounded-md border border-transparent px-2 py-1 text-sm font-semibold duration-100 hover:bg-slate-100"
      >
        <ChevronLeft className="h-4 w-4 stroke-black" /> Back
      </button>
      <h1
        className={cn(
          "pb-10 text-left font-sora text-5xl font-bold capitalize text-slate-950",
          className,
        )}
      >
        {children}
      </h1>
    </div>
  );
};

export default Heading;
