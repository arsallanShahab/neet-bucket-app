import { hashPassword } from "@/lib/authUtils";
import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
  const { name, email, password } = req.body;

  const nameRegex = /^[a-zA-Z ]{2,30}$/;
  const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z]).{8,}$/;

  if (!nameRegex.test(name))
    return res.status(400).send({
      success: false,
      message:
        "Name must be 2-30 characters long and contain only alphabets and spaces",
    });
  if (!emailRegex.test(email))
    return res.status(400).send({
      success: false,
      message: "Please enter a valid email address",
    });
  if (!passwordRegex.test(password)) {
    return res.status(400).send({
      success: false,
      message:
        "Password must be 8 characters long and contain at least 1 lowercase letter, 1 number and 1 special character",
    });
  }

  try {
    const { db } = await connectToDatabase();
    const existingUser = db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).send({ success: false, message: "User exists" });
    }
    const hashedPassword = await hashPassword(password);
    const user = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
    });

    return res
      .status(200)
      .send({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
}
