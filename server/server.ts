import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

app.get("/db-test", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: "DB CONNECTED ✅" });
  } catch (err) {
    res.status(500).json({ status: "DB FAILED ❌", error: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});