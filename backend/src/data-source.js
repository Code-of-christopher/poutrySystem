import { DataSource } from "typeorm";
import { User } from "./entities/User.js";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  entities: [User],
  synchronize: true, 
});
