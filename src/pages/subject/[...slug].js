import Heading from "@/components/Heading";
import ThumbnailCard from "@/components/ThumbnailCard";
import client from "@/lib/contentful";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Index({ data, title }) {
  console.log(data);
  const classElevenChapters = data.filter((item) => item.fields.class === "11");
  const classTwelveChapters = data.filter((item) => item.fields.class === "12");
  return (
    <div className="py-10">
      <div className="flex justify-start px-5 md:px-10">
        <Link
          href="/soft-copy"
          className="flex -translate-x-2 items-center justify-start rounded-md border border-transparent px-2 py-1 duration-100 hover:border-slate-200 hover:bg-slate-100"
        >
          <ChevronLeft className="h-4 w-4 stroke-black" /> Back
        </Link>
      </div>
      <h1 className="w-full max-w-2xl px-5 pb-10 pt-2.5 text-left font-sora text-5xl font-bold capitalize text-slate-950 md:px-10">
        {title}
      </h1>
      <div>
        <h2 className="mb-5 px-5 font-sora text-3xl font-semibold md:px-10">
          Class XI
        </h2>
        <div className="grid grid-cols-1 gap-5 p-5 pt-0 md:grid-cols-2 md:p-10 md:pt-0 lg:grid-cols-3">
          {classElevenChapters.map((item, i) => {
            return <ThumbnailCard key={i} data={item} />;
          })}
        </div>
      </div>
      <div>
        <h2 className="mb-5 px-5 font-inter text-3xl font-semibold md:px-10">
          Class XII
        </h2>
        <div className="grid grid-cols-1 gap-5 p-5 pt-0 md:grid-cols-2 md:p-10 md:pt-0 lg:grid-cols-3">
          {classTwelveChapters.map((item, i) => {
            return <ThumbnailCard key={i} data={item} />;
          })}
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const data = await client.getEntries({
    content_type: "subject",
    order: "sys.createdAt",
  });
  const subjects = data.items;
  //[...slug] generate path for this
  const paths = subjects.map((item) => {
    const subject = item.fields.slug;
    const id = item.sys.id;

    return {
      params: {
        slug: [subject, id],
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
  const data = await client.getEntries({
    content_type: "productDemo",
    // "fields.subject.fields.slug": slug[0],
    "fields.subject.sys.id": slug[1],
    order: "sys.createdAt",
  });
  const items = data.items;
  //get the data
  return {
    props: {
      data: items,
      title: slug[0],
    },
    revalidate: process.env.NODE_ENV === "development" ? 1 : 3600,
  };
}
