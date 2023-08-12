import Heading from "@/components/Heading";
import { FileIcon, TruckIcon } from "@/components/icons";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="relative z-10 flex justify-center overflow-hidden px-3 py-10 pt-14 md:px-10 md:pt-28">
        <h1 className="max-w-full text-center font-sora text-5xl font-[700] leading-tight text-blue-500 md:max-w-4xl md:text-7xl">
          <span className="text-slate-950">Neet Bucket -</span>
          {/* A+ GRADE STUDY MATERIAL FOR YOUR NEET PREPARATION */}
          A+ Grade Study Material for your NEET Preparation
        </h1>
        {/* <Image
          src="/header-bg.png"
          alt="header bg"
          className="absolute -bottom-[25%] -right-[12.5%] z-[-1]"
          width={700}
          height={700}
        /> */}
      </div>
      {/* Teachers */}
      <div className="md: flex w-full flex-col items-center justify-center gap-5 px-10 pb-24 pt-12 pt-6 md:flex-row">
        <Link
          href="/soft-copy"
          className="custom-btn w-full border-slate-900 shadow-custom shadow-slate-900 active:shadow-btn-active md:w-auto"
        >
          {/* <Image
            className="block duration-150 group-hover/button:-translate-y-3 group-hover/button:scale-110"
            alt="pdf"
            src={"/pdf-file.png"}
            width={50}
            height={50}
          /> */}
          <FileIcon className="mr-5 block h-7 w-7 stroke-slate-900" />
          <div>
            Classnotes
            <span className="block text-xs">(PDF&apos;s)</span>
          </div>
        </Link>
        <Link
          href="/soft-copy"
          // className="group/button relative flex flex-col flex-wrap items-center justify-center gap-1 rounded-[20px] border bg-slate-950 px-10 py-5 text-base font-medium text-white transition-all duration-150 hover:bg-slate-800"
          className="custom-btn w-full border-slate-900 bg-indigo-600 text-slate-100 shadow-custom shadow-slate-900 active:shadow-btn-active md:w-auto"
        >
          <TruckIcon className="mr-5 block h-7 w-7 stroke-slate-100" />
          <div>
            Hardcopy
            <span className="block text-xs">Deliver at your doorstep</span>
          </div>
        </Link>
      </div>
      <div>
        <Heading>Teachers</Heading>
        <div className="flex-row-start flex-wrap gap-5 px-10 pb-20">
          {[
            { name: "MR Sir", des: "physics" },
            { name: "Pankaj Sir", des: "Organic chemistry" },
            { name: "Mohit Dadeech Sir", des: "Inorganic chemistry" },
            { name: "Pankaj Sir", des: "Organic chemistry" },
          ].map((_, i) => {
            return (
              <div
                key={i}
                className="flex flex-col items-start gap-0.5 rounded-xl border bg-slate-100 py-3.5 pl-4 pr-16"
              >
                {/* <Avatar className="h-[200px] w-[200px]" /> */}
                <h2 className="text-lg font-bold text-green-950">{_.name}</h2>
                <p className="text-sm font-medium">{_.des}</p>
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
