import { cn } from "@/lib/utils";
import { addToCart, removeFromCart } from "@/redux/reducer/cart";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "./ui/avatar";
import { buttonVariants } from "./ui/button";

const ThumbnailCard = ({ data }) => {
  const {
    chapterName: chapter_name,
    chapterThumbnail: chapter_thumbnail,
    keyPoints: key_points,
    price,
  } = data.fields;
  const { createdAt: created_at, updatedAt: updated_at, id } = data.sys;
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [isInCart, setIsInCart] = useState(false);

  if (chapter_thumbnail?.fields.file.url.startsWith("//")) {
    chapter_thumbnail.fields.file.url =
      chapter_thumbnail.fields.file.url.replace("//", "https://");
  }
  const handleCart = () => {
    if (isInCart) {
      dispatch(removeFromCart(data.sys.id));
      return;
    }
    const item = {
      id: data.sys.id,
      chapter_name: data.fields.chapterName,
      class: data.fields.class,
      teacher_name: data.fields.subject.fields.teacherName,
      subject_name: data.fields.subject.fields.subjectName,
      price: 25,
      image: data.fields.chapterThumbnail.fields.file.url,
    };
    dispatch(addToCart(item));
  };
  useEffect(() => {
    const findItem = cartItems.find((item) => item.id === data.sys.id);
    setIsInCart(findItem ? true : false);
  }, [cartItems]);
  return (
    <div className="flex-col-start group w-full gap-2 rounded-3xl border border-transparent bg-white p-3 duration-300 hover:border-indigo-100 hover:bg-indigo-50">
      <Link
        href={`/chapter/${chapter_name
          .toLowerCase()
          .replace(/\s/g, "-")}/${id}`}
        className="w-full"
      >
        <div className="flex-row-between w-full">
          <div className="rounded-3xl bg-indigo-600 px-4 py-2">
            <h1 className="text-base font-bold text-white">{chapter_name}</h1>
          </div>
          <div className="flex items-center">
            <Avatar className="h-auto w-auto -translate-x-2 scale-75 pr-1.5 text-indigo-600 opacity-0 duration-150 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100">
              <ChevronRight className="h-[18px] w-[18px] stroke-[2px]" />
            </Avatar>
          </div>
        </div>
        <div className="mt-2 h-56 w-full rounded-3xl">
          <Image
            src={chapter_thumbnail?.fields.file.url}
            alt={chapter_thumbnail?.fields.title}
            className="h-full w-full rounded-3xl border-2 object-cover object-top"
            width={500}
            height={500}
          />
        </div>
      </Link>
      <div className="mt-2 flex w-full justify-between">
        <div className="rounded-3xl px-4 py-2 text-base font-semibold text-slate-900">
          Price: ₹{price}
        </div>
        <button
          onClick={handleCart}
          className="h-auto rounded-3xl border bg-slate-900 px-4 py-1 text-xs font-medium text-white"
        >
          {isInCart ? "Remove from cart" : "Add to cart"}
        </button>
      </div>
    </div>
  );
};

export default ThumbnailCard;
