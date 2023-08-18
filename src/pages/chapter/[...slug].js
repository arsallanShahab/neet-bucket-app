import Heading from "@/components/Heading";
import ThumbnailCard from "@/components/ThumbnailCard";
import ViewImage from "@/components/ViewImage";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import client from "@/lib/contentful";
import { cn } from "@/lib/utils";
import { addToCart, removeFromCart } from "@/redux/reducer/cart";
import { Avatar } from "@radix-ui/react-avatar";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Index({ data, title }) {
  const { cartItems } = useSelector((state) => state.cart);
  const [pointsVisible, setPointsVisible] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const { user } = useSelector((state) => state.auth);

  //initializers
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  //handlers
  const handleBuyNow = async () => {
    const item = {
      demo_pdf_id: data.sys.id,
      full_pdf: {
        url: pdfUrl,
        fileSize: `${
          data.fields.fullPdf.fields.pdf.fields.file.details.size / 1000000
        } MB`,
      },
      chapter_name: data.fields.chapterName,
      class: data.fields.class,
      teacher_name: data.fields.subject.fields.teacherName,
      subject_name: data.fields.subject.fields.subjectName,
      price: 25,
      quantity: 1,
      thumbnail: thumbnail_url,
    };
    if (!user) {
      toast({
        title: "Please login to continue",
        status: "error",
      });
      router.push("/login");
      return;
    }
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({
        cartItems: [{ ...item }],
        totalQuantity: 1,
        totalPrice: 25,
        user_id: user.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { url, success, id } = await res.json();
    console.log(url, success, id);
    if (success) {
      router.push(url);
    }
  };

  let thumbnail_url = data.fields.chapterThumbnail.fields.file.url;
  if (thumbnail_url.startsWith("//")) {
    thumbnail_url = "https:" + thumbnail_url;
  }

  let pdfUrl = data.fields.fullPdf.fields.pdf.fields.file.url;
  if (pdfUrl.startsWith("//")) {
    pdfUrl = "https:" + pdfUrl;
  }

  //handlers
  const handleCart = () => {
    if (isInCart) {
      dispatch(removeFromCart(data.sys.id));
      return;
    }

    const item = {
      demo_pdf_id: data.sys.id,
      full_pdf: {
        url: pdfUrl,
        fileSize: `${
          data.fields.fullPdf.fields.pdf.fields.file.details.size / 1000000
        } MB`,
      },
      chapter_name: data.fields.chapterName,
      class: data.fields.class,
      teacher_name: data.fields.subject.fields.teacherName,
      subject_name: data.fields.subject.fields.subjectName,
      price: 25,
      quantity: 1,
      thumbnail: thumbnail_url,
    };
    dispatch(addToCart(item));
  };

  //useEffect
  useEffect(() => {
    const findItem = cartItems.find((item) => item.demo_pdf_id === data.sys.id);
    setIsInCart(findItem ? true : false);
  }, [cartItems]);

  return (
    <div className="p-2.5 md:p-10">
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
              onClick={handleCart}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "group w-full gap-2 break-keep rounded-xl border bg-slate-50 px-10 py-7 text-base text-slate-950 transition-all active:scale-[0.97] active:bg-slate-200 md:flex-1",
              )}
            >
              <span className="translate-x-3 break-keep duration-150 group-hover:translate-x-0">
                {isInCart ? "Remove From Cart" : "Add To Cart"}
              </span>
              <Avatar className="h-auto w-auto -translate-x-2 scale-75 pr-1.5 text-slate-950 opacity-0 duration-150 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100">
                <ShoppingCart className="h-[18px] w-[18px] stroke-[2px]" />
              </Avatar>
            </Button>
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
          <div className="flex-col-start gap-2"></div>
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
