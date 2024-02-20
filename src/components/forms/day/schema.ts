import { z } from "zod";

import {
  ExerciseType,
  Measurements,
  MentalHealthDescriptors,
  StressSymptoms,
  Supplements,
  TimeOfDay,
} from "@prisma/client";

export const formSchema = z.object({
  supplements: z
    .array(
      z.object({
        supplement: z.string(),
        amount: z.number().optional(),
        time_of_day: z.number().optional(),
      }),
    )
    .optional(),
  supplement_name: z.string().optional(),
  supplement_amount: z.number().optional(),
  supplement_time_of_day: z.number().optional(),
  sleep_quality: z.array(z.string()),
  sleep_rating: z.number(),
  sleep_duration: z.number().optional(),
  sleep_wake_time: z.string().optional(),
  sleep_bed_time: z.string().optional(),
  exercise_type: z.enum(["cardio", "strength", "flexibility", ""]).optional(),
  exercise_duration: z.number().optional(),
  exercise_intensity: z.enum(["low", "medium", "high", ""]).optional(),
  exercise_time_of_day: z.number().optional(),
  exercise_fasted: z.boolean().default(false),
  meditation: z.boolean().default(false),
  meditation_duration: z.number().optional(),
  intermittent_fasting: z.boolean().default(false),
  intermittent_fasting_duration: z.string().optional(),
  coldshower: z.boolean().default(false),
  physical_health: z.number().max(10).min(0),
  physical_health_description: z.array(z.string()).optional(),
  mental_health: z.number().max(10).min(1),
  mental_health_description: z.array(z.string()).optional(),
  energy_level: z.number().max(10).min(1),
});

export const sleepSchema = z.object({
  hours: z.number(),
  minutes: z.number(),
  quality: z.array(z.string()),
  rating: z.number(),
  notes: z.string().optional(),
});

export const supplementSchema = z.object({
  date: z.string(),
  name: z.nativeEnum(Supplements).nullable(),
  // name: z.string().optional(),
  amount: z.number().nullable(),
  time_of_day: z.nativeEnum(TimeOfDay).nullable(),
  time_taken: z.string().nullable(),
  measurement: z
    .object({
      label: z.string(),
      value: z.nativeEnum(Measurements),
    })
    .nullable(),
  supplements: z
    .array(
      z.object({
        supplement: z.nativeEnum(Supplements),
        amount: z.number(),
        measurement: z.nativeEnum(Measurements),
        time_taken: z.string(),
      }),
    )
    .min(1),
});

export const stressSchema = z.object({
  rating: z.number().max(10).min(1),
  notes: z.string().optional(),
  symptoms: z.array(z.nativeEnum(StressSymptoms)).max(5),
  time_of_day: z.string(),
});

export const exerciseSchema = z.object({
  type: z.nativeEnum(ExerciseType),
  duration: z.number(),
  intensity: z.enum(["low", "medium", "high"]),
  time_of_day: z.string(),
  fasted: z.boolean().default(false),
  notes: z.string().optional(),
});

export const healthSchema = z.object({
  physical_health: z.number().max(10).min(0),
  physical_health_description: z.array(z.string()).max(5).optional(),
  mental_health: z.number().max(10).min(1),
  mental_health_description: z
    .array(z.nativeEnum(MentalHealthDescriptors))
    .max(5)
    .optional(),
  energy_level: z.number().max(10).min(1),
  notes: z.string().optional(),
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
