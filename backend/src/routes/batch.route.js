import express from 'express';
import { createBatch, updateBatch, deleteBatch, getBatch, getBatchEggs, getBatchHealth, getBatchVaccine } from '../controllers/batch.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { Batch } from "../entities/Batch.js";
import { errorHandler } from '../utils/error.js';
import { AppDataSource } from '../data-source.js';

const router = express.Router();
const batchRepository = AppDataSource.getRepository(Batch);

const fetchBatch = async (req, res, next) => {
  try {
    const batch = await batchRepository.findOne({ where: {id: req.params.id}});
    if (!batch) {
      return next(errorHandler(404, "Batch not found!"));
    }
    req.batch = batch; 
    next();
  } catch (error) {
    next(error);
  }
};

router.post("/create", verifyToken, createBatch);
router.patch("/update/:id", verifyToken, updateBatch);
router.delete("/delete/:id", verifyToken, deleteBatch);
router.get("/:id", verifyToken, getBatch); 

router.get("/eggs/:id", fetchBatch, getBatchEggs); 
router.get("/health/:id", fetchBatch, getBatchHealth); 
router.get("/vaccine/:id", fetchBatch, getBatchVaccine); 

export default router;