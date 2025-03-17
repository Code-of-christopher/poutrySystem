import { AppDataSource } from "../data-source.js";
import { Batch } from "../entities/Batch.js";
import { Egg } from "../entities/Eggs.js";
import { errorHandler } from "../utils/error.js";

const batchRepository = AppDataSource.getRepository(Batch);
const eggRepository = AppDataSource.getRepository(Egg);

export const createBatch = async (req, res, next) => {
  try {
    const batch = batchRepository.create(req.body);
    await batchRepository.save(batch);
    res.status(201).json(batch);
  } catch (error) {
    next(error);
  }
};

export const updateBatch = async (req, res, next) => {
  try {
    const batch = await batchRepository.findOne({ where: { id: req.params.id } });
    if (!batch) return next(errorHandler(404, "Batch not found!"));
    if (String(req.user.id) !== batch.userRef) return next(errorHandler(401, "Unauthorized!"));

    await batchRepository.update(req.params.id, req.body);
    const updatedBatch = await batchRepository.findOne({ where: { id: req.params.id } });
    res.status(200).json(updatedBatch);
  } catch (error) {
    next(error);
  }
};

export const deleteBatch = async (req, res, next) => {
  try {
    const batch = await batchRepository.findOne({ where: { id: req.params.id } });
    if (!batch) return next(errorHandler(404, "Batch not found!"));
    if (String(req.user.id) !== batch.userRef) return next(errorHandler(401, "Unauthorized!"));

    await batchRepository.delete(req.params.id);
    res.status(200).json({ message: "Batch has been deleted!" });
  } catch (error) {
    next(error);
  }
};

export const getBatch = async (req, res, next) => {
  try {
    const batch = await batchRepository.findOne({ where: { id: req.params.id } });
    if (!batch) return next(errorHandler(404, "Batch not found!"));

    res.status(200).json(batch);
  } catch (error) {
    next(error);
  }
};

export const getBatchEggs = async (req, res, next) => {
  try {
    const eggs = await eggRepository.find({ where: { batchId: req.params.id } });
    res.status(200).json(eggs);
  } catch (error) {
    next(error);
  }
};