import Heading from "@/components/Heading";
import { FileIcon, TruckIcon } from "@/components/icons";
import client from "@/lib/contentful";
import Image from "next/image";
import Link from "next/link";

export default function Home({ subjects }) {
  console.log(subjects);
  return (
    <main>
      <div className="relative z-10 flex justify-center overflow-hidden px-3 py-10 pt-14 md:px-10 md:pt-28">
        <h1 className="max-w-full text-center font-sora text-4xl font-[700] leading-tight text-blue-500 md:max-w-4xl md:text-7xl">
          <span className="block text-slate-950 md:inline-block">
            Neet Bucket -{" "}
          </span>
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
      <div className="md: flex w-full flex-col items-center justify-center gap-5 px-5 pb-24 pt-6 md:flex-row md:px-10 md:pt-12">
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
          <FileIcon className="mr-2 h-5 w-5 stroke-slate-900 md:mr-5 md:h-7 md:w-7" />
          <div>
            Classnotes
            <span className="text-xs md:block"> (PDF&apos;s)</span>
          </div>
        </Link>
        <Link
          href="/soft-copy"
          // className="group/button relative flex flex-col flex-wrap items-center justify-center gap-1 rounded-[20px] border bg-slate-950 px-10 py-5 text-base font-medium text-white transition-all duration-150 hover:bg-slate-800"
          className="custom-btn pointer-events-none w-full border-slate-900 bg-indigo-600 text-slate-100 opacity-[0.85] shadow-custom shadow-slate-900 active:shadow-btn-active md:w-auto"
          disabled={true}
        >
          <TruckIcon className="mr-2 h-5 w-5 stroke-slate-100 md:mr-5 md:h-7 md:w-7" />
          <div>
            Hardcopy
            <span className="text-xs md:block">
              {" "}
              (Deliver at your doorstep)
            </span>
          </div>
        </Link>
      </div>
      <div>
        <Heading>
          Most Selling <span className="text-blue-500">Notes</span>
        </Heading>
      </div>
    </main>
  );
}

export const getStaticProps = async () => {
  const res = await client.getEntries({
    content_type: "subject",
  });
  return {
    props: {
      subjects: res.items,
    },
  };
};
