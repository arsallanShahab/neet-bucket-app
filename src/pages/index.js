import Heading from "@/components/Heading";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="flex-row-between relative z-10 h-[calc(400px)] overflow-hidden px-10">
        <div className="flex-col-start gap-5">
          <h1 className="max-w-4xl text-left font-sora text-7xl font-bold leading-none text-blue-500">
            <span className="block text-slate-950">NEET BUCKET -</span>
            A+ GRADE STUDY MATERIAL FOR YOUR NEET PREPARATION
          </h1>
        </div>
        <Image
          src="/header-bg.png"
          alt="header bg"
          className="absolute -bottom-[25%] -right-[12.5%] z-[-1]"
          width={700}
          height={700}
        />
      </div>
      {/* Teachers */}
      <div className="flex-row-center w-full items-stretch gap-5 px-10 pb-24 pt-12">
        <Link
          href="/soft-copy"
          className="group/button flex flex-col flex-wrap items-center justify-center gap-1 rounded-[20px] border px-10 py-5 text-base font-medium transition-all duration-150 hover:bg-slate-50"
        >
          <Image
            className="block duration-150 group-hover/button:-translate-y-3 group-hover/button:scale-110"
            alt="pdf"
            src={"/pdf-file.png"}
            width={50}
            height={50}
          />
          Classnotes
          <span className="block text-xs">(PDF&apos;s)</span>
        </Link>
        <Link
          href="/soft-copy"
          className="group/button relative flex flex-col flex-wrap items-center justify-center gap-1 rounded-[20px] border bg-slate-950 px-10 py-5 text-base font-medium text-white transition-all duration-150 hover:bg-slate-800"
        >
          <Image
            className="block invert group-hover/button:animate-slide-x"
            alt="pdf"
            src={"/delivery-bike.png"}
            width={50}
            height={50}
          />
          Hardcopy
          <span className="block text-xs">Deliver at your doorstep</span>
        </Link>
      </div>
      <div>
        <Heading>Teachers</Heading>
        <div className="flex-row-start flex-wrap gap-10 px-10 pb-20">
          {[
            { name: "MR Sir", des: "physics" },
            { name: "Pankaj Sir", des: "Organic chemistry" },
            { name: "Mohit Dadeech Sir", des: "Inorganic chemistry" },
            { name: "Pankaj Sir", des: "Organic chemistry" },
          ].map((_, i) => {
            return (
              <div
                key={i}
                className="flex-row-start gap-2 rounded-3xl border border-green-300 bg-green-100 p-5"
              >
                {/* <Avatar className="h-[200px] w-[200px]" /> */}
                <h2 className="text-xl font-bold text-green-950">{_.name}</h2>
                <p className="rounded-3xl bg-green-600 px-4 py-2 text-sm font-medium text-white">
                  {_.des}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

{
  /* <Avatar className="h-auto w-auto origin-left scale-x-0 opacity-0 duration-150 group-hover/button:scale-x-100 group-hover/button:opacity-100">
  <ChevronRight className="h-[18px] w-[18px] stroke-[2.5px]" />
</Avatar>; */
}

// <Link href="/subjects">
//   <Button className="group/button items-center gap-2 rounded-[20px] px-10 py-8 pr-5 text-base transition-all duration-150 hover:translate-x-1 hover:pr-10">
//     Hard copy (Books)
//     <Avatar className="h-auto w-auto origin-left scale-x-0 opacity-0 duration-150 group-hover/button:scale-x-100 group-hover/button:opacity-100">
//       <ChevronRight className="h-[18px] w-[18px] stroke-[2.5px]" />
//     </Avatar>
//   </Button>
// </Link>;
