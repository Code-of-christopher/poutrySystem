import express from 'express';
import { getEggRecord, getEggRecords, recordEggProduction } from '../controllers/egg.controller.js'; 
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();


router.post("/record/:batchId", verifyToken, recordEggProduction);
router.get('/all', verifyToken, getEggRecords);
router.get("/:id", getEggRecord);

export default router;