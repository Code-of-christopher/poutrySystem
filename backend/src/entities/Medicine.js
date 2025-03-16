import { EntitySchema } from "typeorm";

export const Medicine = new EntitySchema({
  name: "Medicine",
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
      type: "varchar",
      nullable: false,
    },
    dosage: {
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
});
