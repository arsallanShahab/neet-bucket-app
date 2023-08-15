import CustomButton from "@/components/CustomButton";
import Heading from "@/components/Heading";
import Icon from "@/components/LucideIcon";
import client from "@/lib/contentful";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Index = ({ data }) => {
  console.log(data);
  return (
    <div className="p-5 md:p-10">
      <Heading>Soft copy</Heading>
      <div className="grid w-full grid-cols-1 place-items-center gap-5 border-b border-r pb-20 md:grid-cols-2 lg:grid-cols-3">
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
    <>
      <Link
        href={`/subject/${slug}/${id}`}
        className="flex w-full origin-top items-center justify-start gap-5 rounded-xl border-[0.125em] border-slate-200 px-4 py-5 text-sm font-semibold shadow-custom shadow-slate-100 transition-all duration-150 active:translate-y-2 active:scale-[0.98] active:shadow-btn-active md:px-8 md:py-10 md:text-base"
      >
        <Image
          src={teacher_image?.fields?.file.url.replace("//", "http://")}
          alt={teacher_image?.fields?.file.fileName}
          width={100}
          height={100}
          className="h-12 w-12 origin-top rounded-[50%] object-cover object-top duration-150 sm:h-14 sm:w-14"
        />
        <div>
          <p className="text-xl font-bold sm:text-2xl">{subject}</p>
          <span className="text-sm text-slate-500 md:block">{teacher}</span>
        </div>
      </Link>
    </>
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
