import Heading from "@/components/Heading";
import ThumbnailCard from "@/components/ThumbnailCard";
import ViewPdf from "@/components/ViewPdf";
import { Button, buttonVariants } from "@/components/ui/button";
import client from "@/lib/contentful";
import { cn } from "@/lib/utils";
import { addToCart } from "@/redux/reducer/cart";
import { Avatar } from "@radix-ui/react-avatar";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function Index({ data, title }) {
  const [pointsVisible, setPointsVisible] = useState(false);
  const dispatch = useDispatch();

  console.log(data);

  const handleAddToCart = () => {
    const item = {
      id: data.sys.id,
      chapter_name: data.fields.chapterName,
      class: data.fields.class,
      teacher_name: data.fields.subject.fields.teacherName,
      subject_name: data.fields.subject.fields.subjectName,
      price: 25,
      image: data.fields.demoImage.fields.file.url,
    };

    dispatch(addToCart(item));
  };

  let pdfUrl = data?.fields?.demoPdf?.fields?.file?.url;
  if (pdfUrl.startsWith("//")) {
    pdfUrl = "https:" + pdfUrl;
  }

  return (
    <div className="p-10">
      <div className="grid grid-cols-2 gap-5 rounded-3xl border p-10">
        <ViewPdf url={pdfUrl} />
        <div className="flex-col-start gap-5 px-10 py-10 pr-0">
          <h1 className="font-sora text-6xl font-bold capitalize text-black">
            {title}
          </h1>
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
          <div className="flex w-full gap-5">
            <Button
              onClick={handleAddToCart}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "group flex-1 gap-2 rounded-xl border bg-slate-50 px-10 py-7 text-base text-slate-950",
              )}
            >
              <span className="translate-x-3 duration-150 group-hover:translate-x-0">
                Add to Cart
              </span>
              <Avatar className="h-auto w-auto -translate-x-2 scale-75 pr-1.5 text-slate-950 opacity-0 duration-150 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100">
                <ShoppingCart className="h-[18px] w-[18px] stroke-[2px]" />
              </Avatar>
            </Button>
            <Button
              className={cn(
                buttonVariants({}),
                "group flex-1 gap-2 rounded-xl border px-10 py-7 text-base ",
              )}
            >
              <span className="translate-x-3 duration-150 group-hover:translate-x-0">
                Buy Now
              </span>
              <Avatar className="h-auto w-auto -translate-x-2 scale-75 pr-1.5 text-slate-50 opacity-0 duration-150 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100">
                <ShoppingBag className="h-[18px] w-[18px] stroke-[2px]" />
              </Avatar>
            </Button>
          </div>
          <div className="flex-col-start gap-2">
            <h3 className="text-sm font-semibold text-black">
              Shipping And returns:
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              4-5 standard delivery on all orders. For any queries, please
              contact Customer Service at +91 9876543210 or email us at
              abc@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const data = await client.getEntries({
    content_type: "productDemo",
  });

  const paths = data.items.map((_, i) => {
    const chapter_name = _.fields.chapterName.toLowerCase().replace(/\s/g, "-");
    const id = _.sys.id;
    return {
      params: {
        slug: [chapter_name, id],
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
  console.log(data);
  //get the data
  return {
    props: {
      data,
      title,
    },
    revalidate: process.env.NODE_ENV === "development" ? 1 : 3600,
  };
}
