import { EntitySchema } from "typeorm";

export const Feeds = new EntitySchema({
  name: "Feeds",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    quantity: {
      type: "int",
      nullable: false,
    },
    weight: {
      type: "int",
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
});
