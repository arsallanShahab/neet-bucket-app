import Heading from "@/components/Heading";
import ThumbnailCard from "@/components/ThumbnailCard";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import client from "@/lib/contentful";
import { motion } from "framer-motion";
import { ChevronRight, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Index = ({ data }) => {
  console.log(data);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="p-5 md:p-10"
    >
      <Heading>Hard copy</Heading>
      <div className="grid w-full grid-cols-1 place-items-center gap-5 border-b border-r pb-20 md:grid-cols-2 lg:grid-cols-3">
        {data.length > 0 &&
          data.map((_, i) => {
            let thumbnail_url = _.fields.chapterThumbnail.fields.file.url;
            if (thumbnail_url.startsWith("//images.ctfassets.net/")) {
              thumbnail_url = "https:" + thumbnail_url;
            }
            const isInCart = false;
            return (
              <div
                key={i}
                className="flex-col-start group relative z-10 w-full gap-2 rounded-3xl border border-transparent bg-white p-3 duration-300 hover:border-indigo-100 hover:bg-slate-50"
              >
                <Link
                  href={`/hard-copy/${_.fields.heading
                    .toLowerCase()
                    .replace(/\s/g, "-")}/${_.sys.id}`}
                  className="w-full"
                >
                  <div className="flex-row-between w-full">
                    <div className="rounded-3xl bg-slate-900 px-4 py-2">
                      <h1 className="text-base font-bold text-white">
                        {_.fields.heading}
                      </h1>
                    </div>
                    <div className="flex items-center">
                      <Avatar className="h-auto w-auto -translate-x-2 scale-75 pr-1.5 text-indigo-600 opacity-0 duration-150 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100">
                        <ChevronRight className="h-[18px] w-[18px] stroke-[2px]" />
                      </Avatar>
                    </div>
                  </div>
                  <div className="mt-2 h-80 w-full rounded-3xl">
                    <Image
                      src={thumbnail_url}
                      alt={_.fields.heading}
                      className="h-full w-full rounded-3xl border-2 object-cover object-top"
                      width={500}
                      height={500}
                    />
                  </div>
                </Link>
                <div className="mt-2 flex w-full justify-between">
                  <div className="rounded-3xl px-4 py-2 text-base font-semibold text-slate-900">
                    Price: ₹{_.fields.price}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </motion.div>
  );
};

export async function getStaticProps(ctx) {
  const data = await client.getEntries({
    content_type: "hardCopy",
  });
  return {
    props: {
      data: data.items,
    },
  };
}

export default Index;
