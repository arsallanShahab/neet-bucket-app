import Heading from "@/components/Heading";
import ThumbnailCard from "@/components/ThumbnailCard";
import client from "@/lib/contentful";

export default function Index({ data, title }) {
  console.log(data);
  return (
    <div className="py-10">
      <Heading>{title}</Heading>
      <div className="grid grid-cols-1 gap-5 p-10 pt-0 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item, i) => {
          return <ThumbnailCard key={i} data={item} />;
        })}
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
