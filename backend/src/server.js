import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source.js";
import userRouter from "./routes/auth.route.js";
import batchRouter from "./routes/batch.route.js";
import eggRouter from "./routes/egg.route.js";
import feedsRouter from "./routes/feeds.route.js";
import medicineRouter from "./routes/medicine.route.js";
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://127.0.0.1:5500', // OR use ['http://127.0.0.1:5500', 'http://localhost:5500']
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow headers
}));


app.use("/api/user", userRouter);
app.use("/api/batch", batchRouter);
app.use("/api/eggs", eggRouter);
app.use("/api/feeds", feedsRouter);
app.use("/api/medicine", medicineRouter);

AppDataSource.initialize().then(() => {
  console.log("Database connected!");

  app.listen(3000, () => console.log("Server running on http://localhost:3000"));
}).catch(err => console.error("Database connection error:", err));
