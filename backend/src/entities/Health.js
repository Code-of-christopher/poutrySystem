import { EntitySchema } from "typeorm";

export const Health = new EntitySchema({
  name: "Health",
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
    batchName: {
      type: "varchar",
      nullable: false,
    },
    description: {
      type: "text",
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
    },
  },
});
