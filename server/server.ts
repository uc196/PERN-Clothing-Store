import "dotenv"
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRouter from "./src/routes/authRoutes";
import productRouter from "./src/routes/productRoutes";
import uploadRouter from "./src/routes/uploadRoutes";
import orderRouter from "./src/routes/orderRoutes";
import { serve } from "inngest/express";
import { inngest, functions } from "./src/inngest/index"

const app = express();

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/upload", uploadRouter); 
app.use("/api/orders", orderRouter);
app.use("/api/inngest", serve({ client: inngest, functions }));



app.use((error:any, req: Request, res: Response , next:NextFunction) => {
  console.error(error);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});