import { generateToken, verifyPassword } from "@/lib/authUtils";
import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { email, password } = req.body;

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: "Invalid password" });
    }
    console.log(user);
    const token = generateToken(user);
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      payload: {
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
