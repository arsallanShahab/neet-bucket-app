"use client";

import Heading from "@/components/Heading";
import ThumbnailCard from "@/components/ThumbnailCard";
import client from "@/lib/contentful";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Search = ({ data }) => {
  console.log(data);
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const { query } = router;
  console.log(query);

  useEffect(() => {
    const results = data.filter((item) =>
      item.fields.chapterName.toLowerCase().includes(query.q),
    );
    setSearchResults(results);
  }, [query.q]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="p-5 pb-10 sm:p-10 sm:pb-20"
    >
      <Heading>Search</Heading>
      <p className="pb-5 text-lg text-slate-950">
        showing search results for {`"${query.q}"`}
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {searchResults &&
          searchResults.map((item, i) => {
            return <ThumbnailCard key={i} data={item} />;
          })}
      </div>
    </motion.div>
  );
};

export async function getStaticProps(ctx) {
  const data = await client.getEntries({
    content_type: "productDemo",
  });
  return {
    props: {
      data: data.items,
    },
    // revalidate: 1,
  };
}

export default Search;
