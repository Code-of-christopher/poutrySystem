import { DataSource } from "typeorm";
import { User } from "./entities/User.js";
import { Batch } from "./entities/Batch.js";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  entities: [User, Batch],
  synchronize: true, 
});
