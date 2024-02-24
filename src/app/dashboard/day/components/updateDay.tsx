"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { updateDaySchema } from "~/components/forms/day/schema";
import { Form } from "~/components/ui/form";
import { DayProvider } from "~/lib/state/dayContext";
import type { $Enums } from "@prisma/client";

type Supplements = {
  id?: string;
  name?: $Enums.Supplements;
  amount?: number;
  time_taken?: Date | null | string;
  measurement?: $Enums.Measurements;
}[];

type Exercise = {
  type?: $Enums.ExerciseType;
  id?: string;
  duration?: number;
  time_of_day?: Date;
  intensity?: string;
  fasted?: boolean;
}[];
type Misc =
  | {
      // id?: string;
      meditation?: boolean;
      intermittent_fasting?: boolean;
      cold_shower?: boolean;
    }
  | undefined
  | null;

type Health = {
  id?: string;
  notes?: string | null;
  physical_health?: number;
  physical_health_description?: $Enums.PhysicalHealthDescriptors[];
  mental_health?: number;
  mental_health_description?: $Enums.MentalHealthDescriptors[];
  energy_levels?: number;
}[];

// This doesn't make sense. If the day is present the fields to create a day from the schema are required then these objects are never null.
type Sleep =
  | {
      id?: string;
      hours?: number;
      quality?: string[];
      rating?: number;
      notes?: string | null;
    }
  | null
  | undefined;

type Stress = {
  id?: string;
  rating?: number;
  time_of_day?: Date;
  symptoms?: $Enums.StressSymptoms[];
  notes?: string | null;
}[];

/**
 * @param id: string
 * @returns a form to update the current day the user selects
 */

// ? What is a better way to do this? Could I have filled a context?
export default function UpdateDay({
  id,
  supplements,
  exercise,
  form_misc,
  health,
  sleep,
  stress,
}: {
  id: string;
  supplements: Supplements;
  exercise: Exercise;
  form_misc: Misc;
  health: Health;
  sleep: Sleep;
  stress: Stress;
}) {
  const form = useForm<z.infer<typeof updateDaySchema>>({
    resolver: zodResolver(updateDaySchema),
    defaultValues: {
      id,
      supplements: {
        toggle: supplements.length > 0,
        supplements,
      },
      exercise: {
        toggle: exercise.length > 0,
        ...exercise,
      },
      misc: form_misc,
      health,
      sleep,
      stress,
    },
  });
  // will need a use effect for toggling forms with context
  return (
    <DayProvider>
      <Form {...form}>
        <form></form>
      </Form>
      <div>Hello</div>
    </DayProvider>
  );
}
