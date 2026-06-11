import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { prisma } from "../prisma/client";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;

  const adminEmails = process.env.ADMIN_EMAIL
    ? process.env.ADMIN_EMAIL.split(",").map((e) => e.trim().toLowerCase())
    : [];

  return adminEmails.includes(email.toLowerCase());
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const { password: _, ...userData } = user;

    const token = generateToken(user.id);

    return res.status(201).json({
      user: {
        ...userData,
        isAdmin: isAdminEmail(userData.email),
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { addresses: true },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    const { password: _, ...userData } = user;

    return res.status(200).json({
      message: "Login successful",
      user: {
        ...userData,
        isAdmin: isAdminEmail(userData.email),
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

