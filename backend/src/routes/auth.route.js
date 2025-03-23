import express from "express";
import {verifyToken} from "../utils/verifyUser.js"
import { signUp, signIn, signOut, getCurrentUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);
router.get("/me", verifyToken, getCurrentUser

); 

export default router;