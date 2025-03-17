import express from "express";
import { createFeeds } from "../controllers/feeds.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createFeeds);

export default router;
