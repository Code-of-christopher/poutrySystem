import { EntitySchema } from "typeorm";

export const Batch = new EntitySchema({
  name: "Batch",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      unique: true,
      nullable: false,
    },
    population: {
      type: "int",
      nullable: false,
    },
    deceased: {
      type: "simple-array",
      nullable: false,
      default: "",
    },
    weight: {
      type: "simple-array",
      nullable: false,
      default: "",
    },
    date: {
      type: "text",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    userRef: {
      type: "varchar",
      nullable: false,
    },
  },
});
