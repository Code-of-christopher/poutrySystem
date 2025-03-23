import express from "express";
import { createFeeds, getAllFeeds } from "../controllers/feeds.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createFeeds);
router.get("/all", verifyToken, getAllFeeds);

export default router;
