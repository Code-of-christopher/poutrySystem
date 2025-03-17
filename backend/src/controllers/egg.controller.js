import { AppDataSource } from "../data-source.js";
import { Egg } from "../entities/Eggs.js";
import { Batch } from "../entities/Batch.js";
import { errorHandler } from "../utils/error.js";

const eggRepository = AppDataSource.getRepository(Egg);
const batchRepository = AppDataSource.getRepository(Batch);

export const recordEggProduction = async (req, res, next) => {
  try {
    const batch = await batchRepository.findOne({ where: { id: req.params.batchId } });

    if (!batch) {
      return next(errorHandler(404, "Batch not found!"));
    }

    if (String(req.user.id) !== batch.userRef) {
      return next(errorHandler(401, "You can only record or update egg production for your own batches!"));
    }

    const egg = eggRepository.create({
      batchId: batch.id,
      batchName: batch.name,
      total: req.body.total,
      weight: req.body.weight,
      userRef: req.user.id,
    });

    await eggRepository.save(egg);

    res.status(201).json(egg);
  } catch (error) {
    next(error);
  }
};

export const getEggRecord = async (req, res, next) => {
  try {
    const egg = await eggRepository.findOne({ where: { id: req.params.id } });

    if (!egg) {
      return next(errorHandler(404, "Egg Record not found!"));
    }

    res.status(200).json(egg);
  } catch (error) {
    next(error);
  }
};

export const getEggRecords = async (req, res, next) => {
  try {
    const eggs = await eggRepository.find();
    res.status(200).json(eggs);
  } catch (error) {
    next(error);
  }
};
