// get keys and values of the form data and keys and values of the db schema and make them match

import { z } from "zod";

export const unreliable_dataFormat =
  (formDataSchema: z.Schema, dbSchema: z.Schema) =>
  (formData: z.infer<typeof formDataSchema>) => {
    const formValues = Object.values(formData);
    const formKeys = Object.keys(formData);
    const keys = Object.keys(dbSchema);

    keys.map((key) => {
      const newKey = formKeys.includes(key) ? key : null;
      if (!newKey) return;
      const newValue = formData[key];
      return new Object({ [newKey]: newValue });
    });
  };
