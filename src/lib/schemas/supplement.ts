import { Measurements } from "@prisma/client";
import { z } from "zod";

// right now this is going to be used for creation
export const SupplementSchema = z.object({
  id: z.string().optional(),
  brand_name: z.string(), // will be a search/select field or an str input field
  name: z.string(),
  serving_size: z
    .number()
    .min(1, { message: "Serving size must be equal or greater than 1" })
    .max(10000, { message: "Serving size must be less than 10000" }), // Ex: 2 this might be too high for maxes
  serving_size_unit: z.nativeEnum(Measurements), // Ex: "capsule"
  ingredients: z.object({
    values: z
      .object({
        name: z.string(),
        amount_per_serving: z.number().min(1).max(10000), // EX: 500
        amount_per_serving_unit: z.nativeEnum(Measurements), // Ex: "mg"
        daily_value: z.number().min(1).max(10000).optional().nullable(),
      })
      .array()
      .min(1, { message: "At least one ingredient is required" }),
    // fields for filling out the ingredients fieldArray
    placeHolders: z.object({
      name: z.string().optional(),
      amount_per_serving: z.number().min(1).max(10000).optional().nullable(), // EX: 500
      amount_per_serving_unit: z.nativeEnum(Measurements).optional(), // Ex: "mg"
      daily_value: z.number().min(1).max(10000).optional().nullable(),
    }),
  }),
  description: z.string().optional(),
  other_ingredients: z.string().optional(),
  warnings: z.string().optional(),
  storage: z.string().optional(),
  notes: z.string().optional(),
  company: z.string().optional(),
  manufacture: z.string().optional(),
});

// Where to find all active ingredients to choose from?
/**
 * used for configuration fo the supplements
 */
export const createSupplementSchema = z.object({
  id: z.string().optional(),
  brand_name: z.string(),
  name: z.string(),
  serving_size: z.number(),
  serving_size_unit: z.nativeEnum(Measurements),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amount_per_serving: z.number(),
      amount_per_serving_unit: z.nativeEnum(Measurements),
      daily_value: z.number().optional().nullable(),
    }),
  ),
  description: z.string().optional().nullable(),
  other_ingredients: z.string().optional().nullable(),
  warnings: z.string().optional().nullable(),
  storage: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  manufacture: z.string().optional().nullable(),
});

export const readSupplementSchema = z
  .object({ id: z.string(), activated: z.boolean() })
  .merge(createSupplementSchema);

export const configuredSupplementBaseSchema = z
  .object({
    id: z.string(),
  })
  .merge(
    createSupplementSchema.omit({
      description: true,
      other_ingredients: true,
      warnings: true,
      storage: true,
      notes: true,
      company: true,
      manufacture: true,
    }),
  );

export const createSupplementSchemaClient = z
  .object({
    consumed_amount: z.number().min(1).max(100000),
    consumed_unit: z.nativeEnum(Measurements),
    time: z.union([z.string(), z.date().nullable()]),
    id: z.string().optional(), // id of the array field on read
    supplements_id: z.string().optional(), // id of the supplement
    supplement: createSupplementSchema.partial(),
  })
  .array();

/**
 * many to one from day to supplements
 * one to many from supplements to supplement
 */
export const supplementsSchema = z.object({
  id: z.string().optional(),
  toggle: z.boolean().optional(), // placeholder
  consumed_amount: z.number().min(1).max(100000).optional(), // placeholder
  consumed_unit: z.nativeEnum(Measurements).optional(), // placeholder
  time: z.union([z.date(), z.string()]).optional(), // place holders
  input: createSupplementSchemaClient.optional(),
});

// TODO Decouple schemas from read/edit/create actions
