import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const {
    user_id,
    test_id,
    totalMarks,
    physicsMarks,
    chemistryMarks,
    botanyMarks,
    zoologyMarks,
    attempted,
    skipped,
    markedForReview,
    notVisited,
    timeTaken,
  } = req.body;
  try {
    const { db } = await connectToDatabase();
    const response = await db.collection("tests").updateOne(
      { user_id, test_id },
      {
        //update the property test_details.summary to the value of the object passed in the body and the attempreted property of test_details to the value of the attempted property passed in the body
        $set: {
          attempted: true,
          test_summary: {
            totalMarks,
            physicsMarks,
            chemistryMarks,
            botanyMarks,
            zoologyMarks,
            attempted,
            skipped,
            markedForReview,
            notVisited,
            timeTaken,
          },
        },
      },
      { upsert: false },
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
