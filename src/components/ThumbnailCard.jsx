import { cn } from "@/lib/utils";
import { addToCart, removeFromCart } from "@/redux/reducer/cart";
import { ChevronRight, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "./ui/avatar";
import { Button, buttonVariants } from "./ui/button";

const ThumbnailCard = ({ data }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [isInCart, setIsInCart] = useState(false);

  let thumbnail_url = data.fields.chapterThumbnail.fields.file.url;
  if (thumbnail_url.startsWith("//")) {
    thumbnail_url = "https:" + thumbnail_url;
  }

  let pdfUrl = data.fields.fullPdf.fields.pdf.fields.file.url;
  if (pdfUrl.startsWith("//")) {
    pdfUrl = "https:" + pdfUrl;
  }
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
  useEffect(() => {
    const findItem = cartItems.find((item) => item.demo_pdf_id === data.sys.id);
    setIsInCart(findItem ? true : false);
  }, [cartItems]);
  return (
    <div className="flex-col-start group relative z-10 w-full gap-2 rounded-3xl border border-transparent bg-white p-3 duration-300 hover:border-indigo-100 hover:bg-slate-50">
      <Link
        href={`/chapter/${data.fields.chapterName
          .toLowerCase()
          .replace(/\s/g, "-")}/${data.sys.id}`}
        className="w-full"
      >
        <div className="flex-row-between w-full">
          <div className="rounded-3xl bg-slate-900 px-4 py-2">
            <h1 className="text-base font-bold text-white">
              {data.fields.chapterName}
            </h1>
          </div>
          <div className="flex items-center">
            <Avatar className="h-auto w-auto -translate-x-2 scale-75 pr-1.5 text-indigo-600 opacity-0 duration-150 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100">
              <ChevronRight className="h-[18px] w-[18px] stroke-[2px]" />
            </Avatar>
          </div>
        </div>
        <div className="mt-2 h-56 w-full rounded-3xl">
          <Image
            src={thumbnail_url}
            alt={data.fields.chapterName}
            className="h-full w-full rounded-3xl border-2 object-cover object-top"
            width={500}
            height={500}
          />
        </div>
      </Link>
      <div className="mt-2 flex w-full justify-between">
        <div className="rounded-3xl px-4 py-2 text-base font-semibold text-slate-900">
          Price: ₹{data.fields.price}
        </div>
        <Button
          onClick={handleCart}
          className="h-auto rounded-3xl border bg-indigo-600 px-4 py-0 text-xs font-semibold leading-none text-white"
        >
          {isInCart ? "Remove from cart" : "Add to cart"}{" "}
          <ShoppingCart className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ThumbnailCard;
