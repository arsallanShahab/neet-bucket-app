import { FileIcon, TruckIcon } from "@/components/icons";
import client from "@/lib/contentful";
import { motion } from "framer-motion";
import { BookOpenCheck } from "lucide-react";
import Link from "next/link";

export default function Home({ subjects }) {
  console.log(subjects);
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="relative z-10 flex justify-center overflow-hidden px-3 py-10 pt-14 md:px-10 md:pt-28">
        <h1 className="max-w-full text-center font-sora text-4xl font-[700] leading-tight text-blue-500 md:max-w-4xl md:text-7xl">
          <span className="block text-slate-950 md:inline-block">
            Neet Bucket -{" "}
          </span>
          A+ Grade Study Material for your NEET Preparation
        </h1>
      </div>
      {/* Teachers */}
      <div className="md: flex w-full flex-col items-center justify-center gap-5 px-5 pb-24 pt-6 md:flex-row md:px-10 md:pt-12">
        <Link
          href="/soft-copy"
          className="custom-btn w-full border-slate-900 shadow-custom shadow-slate-900 active:shadow-btn-active md:w-auto"
        >
          <FileIcon className="mr-2 h-5 w-5 stroke-slate-900 md:mr-5 md:h-7 md:w-7" />
          <div>
            Classnotes
            <span className="text-xs md:block"> (PDF&apos;s)</span>
          </div>
        </Link>
        <Link
          href="/hard-copy"
          className="custom-btn w-full border-slate-900 bg-indigo-600 text-slate-100 shadow-custom shadow-slate-900 active:shadow-btn-active md:w-auto"
          // disabled={true}
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
        <Link
          href="/short-notes"
          className="custom-btn w-full border-slate-900 shadow-custom shadow-slate-900 active:shadow-btn-active md:w-auto"
        >
          <FileIcon className="mr-2 h-5 w-5 stroke-slate-900 md:mr-5 md:h-7 md:w-7" />
          <div>
            Short Notes
            <span className="text-xs md:block"> (PDF&apos;s)</span>
          </div>
        </Link>
        {/* <Link
          href="/test-series"
          className="custom-btn w-full border-slate-900 shadow-custom shadow-slate-900 active:shadow-btn-active md:w-auto"
          // disabled={true}
        >
          <BookOpenCheck className="mr-2 h-5 w-5 stroke-slate-900 md:mr-5 md:h-7 md:w-7" />
          <div>
            Test Series
            <span className="text-xs md:block"> (Neet Bucket Test Series)</span>
          </div>
        </Link> */}
      </div>
    </motion.main>
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
