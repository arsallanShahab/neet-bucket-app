import Heading from "@/components/Heading";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const TestSummary = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [marksGraphData, setMarksGraphData] = useState([]);
  const [progressGraphData, setProgressGraphData] = useState([]);
  const { id } = router.query;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`/api/test/summary/${id}`);
        const resJson = await res.json();
        const testData = resJson.data;
        setData(testData);
        setMarksGraphData([
          {
            name: "Physics",
            total: testData.test_summary.physicsMarks || 0.25,
          },
          {
            name: "Chemistry",
            total: testData.test_summary.chemistryMarks || 0.25,
          },
          {
            name: "Botany",
            total: testData.test_summary.botanyMarks || 0.25,
          },
          {
            name: "Zoology",
            total: testData.test_summary.zoologyMarks || 0.25,
          },
        ]);
        setProgressGraphData([
          {
            name: "Attempted",
            total: testData.test_summary.attempted,
          },
          {
            name: "Skipped",
            total: testData.test_summary.skipped,
          },
          {
            name: "Marked for Review",
            total: testData.test_summary.markedForReview,
          },
          {
            name: "Not Visited",
            total: testData.test_summary.notVisited,
          },
        ]);
        console.log(testData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchSummary();
    }
  }, [id]);
  return (
    <div className="p-5 md:p-10">
      <Heading>Test Summary</Heading>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-xl bg-lime-50 p-5">
          {progressGraphData && (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                data={progressGraphData}
              >
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  hide={true}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  domain={[0, 50]}
                  interval={0}
                />
                <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="total"
                    position={"top"}
                    fontSize={12}
                    formatter={(value) => (value > 0 ? `${value}Q` : "None")} // You can format the label as needed
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}{" "}
        </div>
        <div className="rounded-xl bg-lime-50 p-5">
          <h3 className="text-lg font-semibold text-gray-700">
            Question Stats
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-5 font-inter md:grid-cols-2">
            <p className="rounded-xl bg-[#adfa1d] px-3 py-2 text-sm font-semibold text-gray-700">
              <span className="text-black">
                {data?.test_summary?.attempted}
              </span>{" "}
              Attempted
            </p>
            <p className="rounded-xl bg-[#adfa1d] px-3 py-2 text-sm font-semibold text-gray-700">
              <span className="text-black">{data?.test_summary?.skipped}</span>{" "}
              Skipped
            </p>
            <p className="rounded-xl bg-[#adfa1d] px-3 py-2 text-sm font-semibold text-gray-700">
              <span className="text-black">
                {data?.test_summary?.markedForReview}
              </span>{" "}
              Marked for Review
            </p>
            <p className="rounded-xl bg-[#adfa1d] px-3 py-2 text-sm font-semibold text-gray-700">
              <span className="text-black">
                {data?.test_summary?.notVisited}
              </span>{" "}
              Not Visited
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-lime-50 p-5">
          <h3 className="text-lg font-semibold text-gray-700">Marks Stats</h3>
          <div className="mt-5 grid grid-cols-1 gap-5 font-inter md:grid-cols-2">
            <p className="rounded-xl bg-[#adfa1d] px-3 py-2 text-sm font-semibold text-gray-700">
              <span className="text-black">
                {data?.test_summary?.totalMarks}
              </span>{" "}
              Total Marks
            </p>
            <p className="rounded-xl bg-[#adfa1d] px-3 py-2 text-sm font-semibold text-gray-700">
              <span className="text-black">
                {data?.test_summary?.physicsMarks}
              </span>{" "}
              Physics Marks
            </p>
            <p className="rounded-xl bg-[#adfa1d] px-3 py-2 text-sm font-semibold text-gray-700">
              <span className="text-black">
                {data?.test_summary?.chemistryMarks}
              </span>{" "}
              Chemistry Marks
            </p>
            <p className="rounded-xl bg-[#adfa1d] px-3 py-2 text-sm font-semibold text-gray-700">
              <span className="text-black">
                {data?.test_summary?.botanyMarks}
              </span>{" "}
              Botany Marks
            </p>
            <p className="rounded-xl bg-[#adfa1d] px-3 py-2 text-sm font-semibold text-gray-700">
              <span className="text-black">
                {data?.test_summary?.zoologyMarks}
              </span>{" "}
              Zoology Marks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSummary;
