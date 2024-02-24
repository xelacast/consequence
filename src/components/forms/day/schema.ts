import { z } from "zod";

import {
  ExerciseType,
  Measurements,
  MentalHealthDescriptors,
  PhysicalHealthDescriptors,
  StressSymptoms,
  Supplements,
} from "@prisma/client";

/**
 * @description the goal is to have a "it is optional until a
 * field is filled out then it is required" state.
 * Zod does not have a built in feature for this. I will have to get creative
 * or change schema libraries. Used Toggles and superRefine
 */

export const sleepSchema = z.object({
  hours: z.number(),
  quality: z.array(z.string()),
  rating: z.number(),
});

export const supplementSchema = z.object({
  toggle: z.boolean().default(false),
  name: z.nativeEnum(Supplements).optional(),
  amount: z.number().optional(),
  time_taken: z.string(),
  measurement: z
    .object({
      label: z.string(),
      value: z.nativeEnum(Measurements),
    })
    .optional(),
  supplements: z.array(
    z.object({
      name: z.nativeEnum(Supplements),
      amount: z.number(),
      measurement: z.nativeEnum(Measurements),
      time_taken: z.string(),
    }),
  ),
});

export const stressSchema = z.object({
  rating: z.number().max(10).min(1),
  notes: z.string().optional(),
  symptoms: z.array(z.nativeEnum(StressSymptoms)).max(5),
  time_of_day: z.string(),
});

export const exerciseSchema = z.object({
  toggle: z.boolean().default(false).optional(),
  type: z.nativeEnum(ExerciseType),
  duration: z.number(),
  intensity: z.enum(["low", "medium", "high"]),
  time_of_day: z.string(),
  fasted: z.boolean().default(false),
  notes: z.string().optional(),
});

export const healthSchema = z.object({
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

export const miscSchema = z.object({
  meditation: z.boolean().default(false),
  intermittent_fasting: z.boolean().default(false),
  cold_shower: z.boolean().default(false),
});

export const daySchema = z.object({
  date: z.string(),
  sleep: sleepSchema,
  stress: stressSchema,
  health: healthSchema,
  exercise: exerciseSchema.optional().superRefine((data, ctx) => {
    if (data?.toggle) {
      // make the supplements required
      if (
        !data.duration &&
        !data.intensity &&
        !data.time_of_day &&
        !data.type
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Supplements are required",
          path: ["supplements"],
        });
      }
    }
  }),
  supplements: supplementSchema.optional().superRefine((data, ctx) => {
    if (data?.toggle) {
      // make the supplements required
      if (data.supplements && data.supplements?.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Supplements are required",
          path: ["supplements"],
        });
      }
    }
  }),
  misc: miscSchema,
});

/**
 * Update Day Schema
 *
 */

export const updateSleepSchema = z.object({
  hours: z.number(),
  quality: z.array(z.string()),
  rating: z.number(),
  notes: z.string().nullable(),
});

export const updateSupplementSchema = z.object({
  toggle: z.boolean().default(false), // going to cause an issue
  supplements: z.array(
    z.object({
      id: z.string(),
      name: z.nativeEnum(Supplements),
      amount: z.number(),
      measurement: z.nativeEnum(Measurements),
      time_taken: z.string().or(z.date()).or(z.null()),
    }),
  ),
});

export const updateStressSchema = z
  .object({
    id: z.string(),
    rating: z.number().max(10).min(1),
    notes: z.string().optional().nullable(),
    symptoms: z.array(z.nativeEnum(StressSymptoms)).max(5),
    time_of_day: z.date(),
  })
  .array();

export const updateExerciseSchema = z.object({
  id: z.string(),
  toggle: z.boolean().default(false).optional(),
  type: z.nativeEnum(ExerciseType),
  duration: z.number(),
  intensity: z.enum(["low", "medium", "high"]),
  time_of_day: z.string(),
  fasted: z.boolean().default(false),
});

export const updateHealthSchema = z
  .object({
    id: z.string(),
    physical_health: z.number().max(10).min(0),
    physical_health_description: z
      .array(z.nativeEnum(PhysicalHealthDescriptors))
      .max(5),
    mental_health: z.number().max(10).min(1),
    mental_health_description: z
      .array(z.nativeEnum(MentalHealthDescriptors))
      .max(5),
    energy_levels: z.number().max(10).min(1),
  })
  .array();

export const updateMealsSchema = z.object({
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

export const updateMiscSchema = z.object({
  meditation: z.boolean().default(false),
  intermittent_fasting: z.boolean().default(false),
  cold_shower: z.boolean().default(false),
});

// This doesn't make sense. If the day is present the fields to create a day from the schema are required then these objects are never null.
export const updateDaySchema = z.object({
  id: z.string(),
  sleep: updateSleepSchema.nullable(),
  stress: updateStressSchema,
  health: updateHealthSchema,
  exercise: updateExerciseSchema.optional().superRefine((data, ctx) => {
    if (data?.toggle) {
      // make the supplements required
      if (
        !data.duration &&
        !data.intensity &&
        !data.time_of_day &&
        !data.type
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Supplements are required",
          path: ["supplements"],
        });
      }
    }
  }),
  supplements: updateSupplementSchema.optional().superRefine((data, ctx) => {
    if (data?.toggle) {
      // make the supplements required
      if (data.supplements && data.supplements?.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Supplements are required",
          path: ["supplements"],
        });
      }
    }
  }),
  misc: miscSchema.nullable(),
});
