import ViewImage from "@/components/ViewImage";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import client from "@/lib/contentful";
import { cn } from "@/lib/utils";
import { setHardCopyItem } from "@/redux/reducer/cart";
import { Avatar } from "@radix-ui/react-avatar";
import { motion } from "framer-motion";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Index({ data, title }) {
  console.log(data);
  const { cartItems } = useSelector((state) => state.cart);
  const [pointsVisible, setPointsVisible] = useState(false);

  //initializers
  const dispatch = useDispatch();
  const router = useRouter();

  //handlers
  const handleBuyNow = async () => {
    // const item = {
    //   id: data.sys.id,
    //   heading: data.fields.heading,
    //   price: data.fields.price,
    //   quantity: 1,
    //   thumbnail: thumbnail_url,
    // };
    dispatch(setHardCopyItem({ data }));
    router.push("buy");
  };

  let thumbnail_url = data.fields.chapterThumbnail.fields.file.url;
  if (thumbnail_url.startsWith("//")) {
    thumbnail_url = "https:" + thumbnail_url;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="p-2.5 md:p-10"
    >
      <div className="grid grid-cols-1 gap-5 rounded-3xl p-2.5 md:p-10 lg:grid-cols-2">
        <ViewImage images={data.fields?.demoImages} />
        <div className="flex-col-start gap-5 px-0 py-5 pb-20 pr-0 md:px-10 md:py-10">
          <h1 className="font-sora text-3xl font-bold capitalize text-black md:text-6xl">
            {title}
          </h1>
          <h3 className="text-lg font-semibold text-black">
            Price :{" "}
            <span className="text-3xl text-indigo-600">
              {data.fields?.price ? `₹${data.fields?.price}` : "Free"}
            </span>
          </h3>
          <div className="flex-col-start gap-5">
            <h3 className="text-sm font-semibold text-black">Key Points</h3>
            <div
              style={{
                maxHeight: pointsVisible ? "100%" : "145px",
              }}
              className="relative z-10 overflow-hidden"
            >
              <div
                style={{
                  display: pointsVisible ? "none" : "flex",
                }}
                className="flex-row-center absolute bottom-0 z-20 w-full rounded-3xl bg-gradient-to-b from-transparent to-slate-50 px-4 py-6"
              >
                <button
                  onClick={() => setPointsVisible(true)}
                  className="text-slate-800d z-30 mt-2 rounded-3xl border bg-slate-50 px-4 py-2 text-xs font-medium"
                >
                  Show All
                </button>
              </div>
              <ul className="flex list-inside list-disc flex-col gap-2 pl-3">
                {data?.fields?.keyPoints?.map((_, i) => {
                  return (
                    <li
                      key={i}
                      className="font-mediums text-sm leading-loose text-slate-600"
                    >
                      {_}
                    </li>
                  );
                })}
              </ul>
              <div
                className="flex-row-end"
                style={{
                  display: pointsVisible ? "flex" : "none",
                }}
              >
                <button
                  onClick={() => setPointsVisible(false)}
                  className="mt-2 rounded-3xl border bg-slate-50 px-4 py-2 text-xs font-medium text-slate-800"
                >
                  Show Less
                </button>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col flex-wrap gap-5 md:flex-row">
            <Button
              className={cn(
                buttonVariants({}),
                "group w-full gap-2  rounded-xl border px-10 py-7 text-base transition-all active:scale-[0.97] active:bg-slate-800 md:flex-1 ",
              )}
              onClick={handleBuyNow}
            >
              <span className="translate-x-3 duration-150 group-hover:translate-x-0">
                Buy Now
              </span>
              <Avatar className="h-auto w-auto -translate-x-2 scale-75 pr-1.5 text-slate-50 opacity-0 duration-150 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100">
                <ShoppingBag className="h-[18px] w-[18px] stroke-[2px]" />
              </Avatar>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export async function getStaticPaths() {
  const data = await client.getEntries({
    content_type: "hardCopy",
  });

  const paths = data.items.map((_, i) => {
    const heading = _.fields.heading.toLowerCase().replace(/\s/g, "-");
    const id = _.sys.id;
    return {
      params: {
        slug: [heading, id],
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}
export async function getStaticProps(ctx) {
  //get the slug
  const { slug } = ctx.params;
  const title = slug[0].replace(/-/g, " ");
  const data = await client.getEntry(slug[1]);
  //   console.log(data);
  //get the data
  return {
    props: {
      data,
      title,
    },
    // revalidate: process.env.NODE_ENV === "development" ? 1 : 3600,
  };
}
