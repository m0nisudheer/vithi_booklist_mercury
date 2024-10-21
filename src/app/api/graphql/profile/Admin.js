
import mercury from "@mercury-js/core";

const rules = [
  {
    modelName: "User",
    access: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  },
  {
    modelName: "Book",
    access: {
      create: true,
      update: true,
      delete: true,
      read: true,
    },
  },
  {
    modelName: "superAdmin",
    access: {
      create:false,
      update:false,
      delete:false,
      read: true,
  }
}
];

export const adminProfile = mercury.access.createProfile("ADMIN", rules);
