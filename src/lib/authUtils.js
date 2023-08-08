import { compare, genSalt, hash } from "bcryptjs";

import jwt, { decode, sign, verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "65&^%gjhgh^&%&^%&YHJG#@##";

export const hashPassword = async (password) => {
  const salt = await genSalt(12);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
};

export const verifyPassword = async (password, hashedPassword) => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};

export const generateToken = (user) => {
  const token = sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  return token;
};

export const verifyToken = (token) => {
  try {
    const decoded = decode(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log(error);
    return null;
  }
};
