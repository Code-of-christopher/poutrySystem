import { DataSource } from "typeorm";
import { User } from "./entities/User.js";
import { Batch } from "./entities/Batch.js";
import { Egg } from "./entities/Eggs.js";
import { Feeds } from "./entities/Feeds.js";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  entities: [User, Batch, Egg, Feeds],
  synchronize: true, 
});
