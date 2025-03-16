import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    username: {
      type: "varchar",
      unique: true,
      nullable: false,
    },
    email: {
      type: "varchar",
      unique: true,
      nullable: false,
    },
    password: {
      type: "varchar",
      nullable: false,
    },
    avatar: {
      type: "varchar",
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
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
