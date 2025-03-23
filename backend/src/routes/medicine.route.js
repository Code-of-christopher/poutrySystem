import express from 'express';
import { createMedicine, deleteMedicine, getAllMedicine } from '../controllers/medicine.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/create", verifyToken, createMedicine);
router.get("/all", verifyToken, getAllMedicine);
router.delete("/delete/:id", verifyToken, deleteMedicine);

export default router;