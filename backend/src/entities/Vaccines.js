import { EntitySchema } from "typeorm";

export const Vaccine = new EntitySchema({
  name: "Vaccine",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    batchId: {
      type: "int",
      nullable: false,
    },
    age: {
      type: "int",
      nullable: false,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    method: {
      type: "varchar",
      nullable: false,
    },
    vaccinated: {
      type: "varchar",
      nullable: false,
    },
    userRef: {
      type: "varchar",
      nullable: false,
    },
    createdAt: {
      type: "text",
      default: () => "CURRENT_TIMESTAMP",
    },
    updatedAt: {
      type: "text",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    batch: {
      target: "Batch",
      type: "many-to-one",
      joinColumn: { name: "batchId" },
      onDelete: "CASCADE",
    },
  },
});
