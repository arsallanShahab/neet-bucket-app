import client from "@/lib/contentful";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const Index = ({ testSeries }) => {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  const handleCheckout = async (e) => {
    const { testId, testName, testDesc } = e.target.dataset;
    if (!user) {
      toast({
        title: "Please login to continue",
        status: "error",
      });
      router.push("/login");
      return;
    }
    const res = await fetch("/api/stripe/test/buy", {
      method: "POST",
      body: JSON.stringify({
        test_id: testId,
        user_id: user.id,
        test_name: testName,
        test_desc: testDesc,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { url, success, id } = await res.json();
    console.log(url, success, id);
    if (success) {
      router.push(url);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 md:p-10 lg:grid-cols-3 xl:grid-cols-4">
      {testSeries.map((_, i) => {
        return (
          <button
            key={i}
            // href={`/test-series/${_.fields.testSeriesName
            //   .toLowerCase()
            //   .replace(/\s/g, "-")}/${_.sys.id}`}
            className="group relative z-20 flex w-full flex-col items-start justify-center rounded-2xl bg-[rgba(236,249,118,.2)] p-8 pb-5 pr-5"
          >
            <div className="absolute right-4 top-4 z-30 flex h-16 w-16 items-start justify-end rounded-3xl bg-[#ecf976]  text-center font-sora font-semibold duration-200 group-hover:right-0 group-hover:top-0 group-hover:z-10 group-hover:h-full group-hover:w-full group-hover:rounded-xl">
              {/* <BookOpen className="h-6 w-6" /> */}
              <span className="h-full w-auto pr-3.5 text-center leading-[4rem] duration-150 group-hover:pr-5">
                ₹60
              </span>
            </div>
            <div className="relative z-20 mt-4 w-full text-left">
              <h1 className="inline-block translate-x-5 scale-150 text-xl font-bold duration-150 group-hover:translate-x-0 group-hover:scale-100">
                {_.fields.testSeriesName}
              </h1>
              <p className="mt-1 max-w-[200px] font-inter text-sm font-medium duration-150">
                (Neet Bucket Test Series)
              </p>
              <div className="flex justify-end">
                <button
                  data-test-id={_.sys.id}
                  data-test-name={_.fields.testSeriesName}
                  data-test-desc={"Neet Bucket Test Series"}
                  onClick={handleCheckout}
                  className="mt-1 max-w-[200px] -translate-x-3 rounded-md bg-white px-3 py-1.5 font-inter text-sm font-semibold opacity-0 duration-150 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </button>
          // <Link
          //   key={i}
          //   href={`/test-series/${_.fields.testSeriesName
          //     .toLowerCase()
          //     .replace(/\s/g, "-")}/${_.sys.id}`}
          //   className="flex flex-col"
          //   // disabled={true}
          // >
          //   <div className="relative z-10 flex origin-top items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-all duration-150 active:translate-y-1 active:scale-[0.98] md:py-4 md:pl-6 md:pr-8 md:text-xl">
          //     <div>
          //       {_.fields.testSeriesName}
          //       <span className="text-sm md:block">
          //         {" "}
          //         (Neet Bucket Test Series)
          //       </span>
          //     </div>
          //   </div>
          //   <div className="-mt-5 flex w-full items-center justify-between rounded-xl bg-indigo-100 px-2 pb-2 pt-6 text-black">
          //     <div className="ml-2 text-base font-semibold">₹50</div>
          //     <button
          //       className="text-md ml-2 h-auto rounded-3xl px-4 py-1.5 text-sm font-semibold text-indigo-600"
          //       variant="ghost"
          //     >
          //       Buy Now
          //     </button>
          //   </div>
          // </Link>
        );
      })}
    </div>
  );
};

export default Index;

export const getStaticProps = async () => {
  const res = await client.getEntries({
    content_type: "testSeries",
  });
  return {
    props: {
      testSeries: res.items,
    },
  };
};
