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
    <div className="p-5 sm:p-10">
      <Heading>{title}</Heading>
      {classElevenChapters && classElevenChapters.length > 0 ? (
        <div>
          <h2 className="mb-5 font-sora text-3xl font-semibold">Class XI</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {classElevenChapters.map((item, i) => {
              return <ThumbnailCard key={i} data={item} />;
            })}
          </div>
        </div>
      ) : null}
      <div className="relative flex w-full flex-col items-start justify-start">
        <h2 className="relative -z-10 -mb-9 rounded-2xl border bg-white px-5 pb-12 pt-3 font-inter text-xl font-semibold">
          Class XII
        </h2>
        <div className="relative z-0 grid w-full grid-cols-1 gap-5 rounded-3xl border bg-white p-2 md:grid-cols-2 lg:grid-cols-3">
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
