import mercury from "@mercury-js/core";

export const Book = mercury.createModel(
  "Book",
  {
    title: { 
      type: "string"
    },
    author: {
      type: "string",
    },
    year: {
      type: "string",
    },
  },
);
