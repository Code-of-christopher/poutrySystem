import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source.js";
import userRouter from "./routes/auth.route.js";
import batchRouter from "./routes/batch.route.js";
import eggRouter from "./routes/egg.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/batch", batchRouter);
app.use("/api/eggs", eggRouter);

AppDataSource.initialize().then(() => {
  console.log("Database connected!");

  app.listen(3000, () => console.log("Server running on http://localhost:3000"));
}).catch(err => console.error("Database connection error:", err));
