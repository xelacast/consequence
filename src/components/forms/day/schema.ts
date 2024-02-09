import { z } from "zod";

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
  sleep_quality: z.number().optional(),
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
});
