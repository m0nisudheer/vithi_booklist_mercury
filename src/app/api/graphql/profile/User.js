import mercury from "@mercury-js/core";

const userRules = [
  {
    modelName: "User",
    access: {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
  },
  {
    modelName: "Book",
    access: {
      create: false,
      update: false,
      delete: false,
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
    },
  },
];

export const userProfile = mercury.access.createProfile("USER", userRules);
