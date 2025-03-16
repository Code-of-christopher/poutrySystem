import { EntitySchema } from "typeorm";

export const PoultryTotals = new EntitySchema({
  name: "PoultryTotals",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    totalChicks: {
      type: "int",
      nullable: false,
    },
    totalGrowers: {
      type: "int",
      nullable: false,
    },
    totalLayers: {
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
