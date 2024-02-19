import Heading from "@/components/Heading";
import client from "@/lib/contentful";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

const Index = ({ data }) => {
  console.log(data);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="p-5 md:p-10"
    >
      <Heading>Soft copy</Heading>

      <div className="grid w-full grid-cols-1 place-items-center gap-5 pb-20 md:grid-cols-2 lg:grid-cols-3">
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
    </motion.div>
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
    // revalidate: process.env.NODE_ENV === "development" ? 1 : 3600,
  };
}

export default Index;
