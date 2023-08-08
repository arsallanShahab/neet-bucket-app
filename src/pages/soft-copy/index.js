import Heading from "@/components/Heading";
import Icon from "@/components/LucideIcon";
import client from "@/lib/contentful";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Index = ({ data }) => {
  console.log(data);
  return (
    <div className="py-10">
      <Heading>Soft Copy</Heading>
      <div className="flex-row-start flex-wrap gap-10 px-10 pb-20">
        <div className="grid w-full grid-cols-1 place-items-center gap-20 md:grid-cols-2 lg:grid-cols-3">
          {data.length > 0 &&
            data?.map((item, i) => {
              return (
                <AnimatedCard
                  key={i}
                  subject={item.fields.subjectName}
                  teacher={item.fields.teacherName}
                  icon_name={item.fields.iconName}
                  teacher_image={item.fields.teacherImage}
                  slug={item.fields.slug}
                  id={item.sys.id}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

const Card = (props) => {
  const { subject, teacher, icon_name, slug } = props;
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-3xl p-2.5",
        color === "blue" && "border border-blue-300 bg-blue-100",
        color === "green" && "border border-green-300 bg-green-100",
        color === "red" && "border border-red-300 bg-red-100",
        color === "yellow" && "border border-yellow-300 bg-yellow-100",
      )}
    >
      <h2 className="rounded-3xl bg-blue-600 px-4 py-2 text-2xl font-bold text-white">
        {subject}
      </h2>
      <p className="rounded-3xl bg-blue-600 px-4 py-2 text-sm font-medium text-white">
        {teacher}
      </p>
    </div>
  );
};

const AnimatedCard = (props) => {
  const { subject, teacher, icon_name, slug = "#", id, teacher_image } = props;
  console.log(teacher_image);
  return (
    <Link
      href={`/subject/${slug}/${id}`}
      className="group relative z-20 flex w-full flex-col items-start justify-center rounded-2xl border border-indigo-100 bg-indigo-50 px-4 pb-3 pt-6 duration-150 hover:bg-indigo-600"
    >
      <div className="absolute right-4 top-4 z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 p-3  duration-150 group-hover:h-20 sm:right-2 sm:top-2">
        <Icon name={icon_name} size={"24px"} color={"#FFFFFF"} />
      </div>
      <div className="translate-y-2 duration-150 group-hover:translate-y-0">
        <div className="h-10 w-10 origin-top translate-x-2 duration-150 group-hover:w-24 ">
          <Image
            src={teacher_image?.fields?.file.url.replace("//", "http://")}
            alt={teacher_image?.fields?.file.fileName}
            width={100}
            height={100}
            className="h-full w-full rounded-3xl object-cover object-top"
          />
        </div>
        <div className="relative z-20 mt-2 w-full text-left group-hover:text-white">
          <h1 className="flex w-full translate-x-2 flex-wrap font-sora text-3xl font-bold duration-150  group-hover:translate-x-0">
            {subject}
          </h1>
          <p className="mt-2 -translate-y-0 font-inter text-sm font-medium opacity-0 duration-150 group-hover:-translate-y-2 group-hover:opacity-100">
            {teacher}
          </p>
        </div>
      </div>
    </Link>
  );
};

export async function getStaticProps(ctx) {
  const data = await client.getEntries({
    content_type: "subject",
    // order : "sys.createdAt",
    order: "sys.createdAt",
  });

  console.log(JSON.stringify(data, null, 2));

  // const subjects = data.items.map((item) => item.fields);
  const subjects = data.items;

  return {
    props: {
      data: subjects,
    },
    revalidate: process.env.NODE_ENV === "development" ? 1 : 3600,
  };
}

export default Index;
