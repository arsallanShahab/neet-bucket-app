import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Avatar } from "./ui/avatar";
import { buttonVariants } from "./ui/button";

const ThumbnailCard = ({ data }) => {
  const {
    chapterName: chapter_name,
    chapterThumbnail: chapter_thumbnail,
    keyPoints: key_points,
  } = data.fields;
  const { createdAt: created_at, updatedAt: updated_at, id } = data.sys;

  if (chapter_thumbnail?.fields.file.url.startsWith("//")) {
    chapter_thumbnail.fields.file.url =
      chapter_thumbnail.fields.file.url.replace("//", "https://");
  }

  return (
    <Link
      href={`/chapter/${chapter_name.toLowerCase().replace(/\s/g, "-")}/${id}`}
      className="flex-col-start group gap-2 rounded-3xl border border-transparent bg-white p-3 duration-300 hover:border-indigo-100 hover:bg-indigo-50"
    >
      <div className="flex-row-between w-full">
        <div className="rounded-3xl bg-indigo-600 px-4 py-2">
          <h1 className="text-base font-bold text-white">{chapter_name}</h1>
        </div>
        <Avatar className="h-auto w-auto -translate-x-2 scale-75 pr-1.5 text-indigo-600 opacity-0 duration-150 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100">
          <ChevronRight className="h-[18px] w-[18px] stroke-[2px]" />
        </Avatar>
      </div>
      <div className="h-56 w-full rounded-3xl">
        <Image
          src={chapter_thumbnail?.fields.file.url}
          alt={chapter_thumbnail?.fields.title}
          className="h-full w-full rounded-3xl border-2 object-cover object-top"
          width={500}
          height={500}
        />
      </div>
    </Link>
  );
};

export default ThumbnailCard;
