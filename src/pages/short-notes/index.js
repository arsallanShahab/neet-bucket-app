import Heading from "@/components/Heading";
import ThumbnailCard from "@/components/ThumbnailCard";
import client from "@/lib/contentful";
import { motion } from "framer-motion";
import React from "react";

const Index = ({ data }) => {
  console.log(data, "data");
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="p-5 sm:p-10"
    >
      <Heading>Short Notes</Heading>
      <div className="relative z-0 grid w-full grid-cols-1 gap-5 rounded-3xl border bg-white p-2 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((item, i) => {
          return <ThumbnailCard key={i} data={item} />;
        })}
      </div>
    </motion.div>
  );
};

export async function getStaticProps(ctx) {
  const data = await client.getEntries({
    content_type: "shortNotes",
    order: "sys.createdAt",
  });
  const items = data.items;
  //get the data
  return {
    props: {
      data: items,
    },
  };
}

export default Index;
