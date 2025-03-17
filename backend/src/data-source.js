import { DataSource } from "typeorm";
import { User } from "./entities/User.js";
import { Batch } from "./entities/Batch.js";
import { Egg } from "./entities/Eggs.js";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  entities: [User, Batch, Egg],
  synchronize: true, 
});
