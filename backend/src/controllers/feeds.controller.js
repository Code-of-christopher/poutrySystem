import { AppDataSource } from "../data-source.js";
import { Feeds } from "../entities/Feeds.js";

const feedRepository = AppDataSource.getRepository(Feeds);

export const createFeeds = async (req, res, next) => {
  try {
    const { userRef, name, quantity, weight } = req.body;

    // Find existing feed for the user
    let existingFeed = await feedRepository.findOne({
      where: { userRef, name },
    });

    if (existingFeed) {
      // Update existing feed
      existingFeed.quantity = quantity;
      existingFeed.weight = weight;
      await feedRepository.save(existingFeed);
      res.status(200).json(existingFeed);
    } else {
      // Create new feed entry
      const newFeed = feedRepository.create({
        userRef,
        name,
        quantity,
        weight,
      });
      await feedRepository.save(newFeed);
      res.status(201).json(newFeed);
    }
  } catch (error) {
    next(error);
  }
};

export const getAllFeeds = async (req, res, next) => {
  try {
    const feeds = await feedRepository.find();
    res.status(200).json(feeds);
    console.log(feeds);
  } catch (error) {
    next(error);
  }
};
