import { NextFunction, Request, Response } from "express";
import { prisma } from "../prisma/client";

export const admin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const adminEmail = process.env.ADMIN_EMAIL
      ? process.env.ADMIN_EMAIL.split(",").map((e) => e.trim().toLowerCase())
      : [];

    if (!adminEmail.includes(user.email.toLowerCase())) {
        if(req.user) req.user.isAdmin = true; // Optionally set isAdmin to false for non-admin users
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};