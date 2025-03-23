import { EntitySchema } from "typeorm";

export const Egg = new EntitySchema({
  name: "Egg",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    total: {
      type: "int",
      nullable: false,
    },
    weight: {
      type: "float",
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
      nullable: false,
      eager: true,  
    },
  },
});
