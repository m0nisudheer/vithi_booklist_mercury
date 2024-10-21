import mercury from "@mercury-js/core";

export const superAdmin = mercury.createModel("superAdmin", {
  email: {
    type: "string",
    unique: true, 
  },
});
