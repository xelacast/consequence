import { z } from "zod";

import {
  ExerciseType,
  Measurements,
  MentalHealthDescriptors,
  PhysicalHealthDescriptors,
  StressSymptoms,
} from "@prisma/client";
import { supplementsSchema } from "./supplement";

/**
 * @description the goal is to have a "it is optional until a
 * field is filled out then it is required" state.
 * Zod does not have a built in feature for this. I will have to get creative
 * or change schema libraries. Used Toggles and superRefine
 */

export const sleepSchema = z.object({
  id: z.string().optional(),
  hours: z.number(),
  quality: z.array(z.string()).min(1).max(5),
  rating: z.number(),
  notes: z.string().optional().nullable(),
});

/**
 * @relationship with day one-to-many
 */
export const stressSchema = z.object({
  id: z.string().optional(),
  rating: z.number().max(10).min(1),
  notes: z.string().optional().nullable(),
  symptoms: z.array(z.nativeEnum(StressSymptoms)).max(5),
  time_of_day: z.union([z.string(), z.date()]),
  // time_of_day_string: z.string().optional(),
});

/**
 * @relationship with day one-to-many
 * @description not a friendly schema to have optional on update
 */
export const exerciseSchema = z.object({
  id: z.string().optional(),
  toggle: z.boolean().default(false).optional(),
  type: z.nativeEnum(ExerciseType),
  duration: z.number(),
  intensity: z.enum(["low", "medium", "high"]),
  time_of_day_string: z.string().optional(),
  time_of_day: z.union([z.string(), z.date()]),
  fasted: z.boolean().default(false),
  notes: z.string().optional(),
});

/**
 * @relationship with day one-to-many
 */
export const healthSchema = z.object({
  id: z.string().optional(),
  physical_health: z.number().max(10).min(0),
  physical_health_description: z
    .array(z.nativeEnum(PhysicalHealthDescriptors))
    .max(5)
    .optional(),
  mental_health: z.number().max(10).min(1),
  mental_health_description: z
    .array(z.nativeEnum(MentalHealthDescriptors))
    .max(5)
    .optional(),
  energy_levels: z.number().max(10).min(1),
});

export const mealsSchema = z.object({
  id: z.string().optional(),
  meal: z.string(),
  notes: z.string().optional(),
  time_of_day: z.string(),
  calorie_intake: z.number().optional(),
  macros: z
    .object({
      protein: z.number().nullable(),
      carbs: z.number().nullable(),
      fats: z.number().nullable(),
      sugars: z.number().nullable(),
      fiber: z.number().nullable(),
      sodium: z.number().nullable(),
    })
    .nullable(),
});

/**
 * @relationship with day one-to-one
 */
export const miscSchema = z.object({
  id: z.string().optional(),
  meditation: z.boolean().default(false),
  intermittent_fasting: z.boolean().default(false),
  cold_shower: z.boolean().default(false),
});

export const daySchema = z.object({
  id: z.string().optional(),
  date: z.string().optional(),
  sleep: sleepSchema, // required
  stress: stressSchema, // required
  health: healthSchema, // required
  exercise: exerciseSchema
    .superRefine((data, ctx) => {
      if (data?.toggle) {
        if (
          !data.duration &&
          !data.intensity &&
          !data.time_of_day &&
          !data.type
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Exercise is required if the toggle is on",
            path: ["exercise"],
          });
        }
      }
    })
    .optional(),
  supplements: supplementsSchema
    .superRefine((data, ctx) => {
      if (data?.toggle) {
        // make the supplements required
        if (data.input && data.input?.length < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Supplements are required",
            path: ["supplements"],
          });
        }
      }
    })
    .optional(),
  misc: miscSchema,
});

export const updateSchema = z.object({
  id: z.string(),
  supplements: z
    .object({
      consumed_amount: z.number(),
      consumed_unit: z.nativeEnum(Measurements),
      time: z.date().nullable(),
      id: z.string().optional(),
      consumed_supplement_id: z.string(), // what is this?
    })
    .array(),
  exercise: exerciseSchema.optional(),
  sleep: sleepSchema,
  health: healthSchema,
  stress: stressSchema,
  misc: miscSchema,
});
