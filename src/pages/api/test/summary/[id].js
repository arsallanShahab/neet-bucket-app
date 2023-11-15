import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { id } = req.query;
  console.log(id, "id");
  try {
    const { db } = await connectToDatabase();
    const objId = new ObjectId(id);
    const test = await db.collection("tests").findOne({ _id: objId });
    console.log(test, "test");
    return res.status(200).json({ success: true, data: test });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
}
