"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { daySchema, type updateSchema } from "~/lib/schemas/day";
import type { $Enums } from "@prisma/client";
import { DayFormContainer } from "~/app/dashboard/day/components/day";
import { ConfiguredSupplements } from "~/app/dashboard/day/components/forms/supplements";
import { ExerciseFormV2 } from "~/app/dashboard/day/components/forms/exercise";
import { editDayAction } from "~/lib/actions/dayAction";
import type { Supplements } from "~/lib/types/supplements";
import type { Node } from "~/lib/state/dayContext";

type Exercise = {
  type?: $Enums.ExerciseType;
  id?: string;
  duration?: number;
  time_of_day?: Date | string;
  intensity?: "low" | "medium" | "high";
  fasted?: boolean;
}[];
type Misc = {
  meditation?: boolean;
  intermittent_fasting?: boolean;
  cold_shower?: boolean;
};

type Health = {
  id?: string;
  notes?: string | null;
  physical_health?: number;
  physical_health_description?: $Enums.PhysicalHealthDescriptors[];
  mental_health?: number;
  mental_health_description?: $Enums.MentalHealthDescriptors[];
  energy_levels?: number;
};

// This doesn't make sense. If the day is present the fields to create a day from the schema are required then these objects are never null.
type Sleep = {
  id?: string;
  hours?: number;
  quality?: string[];
  rating?: number;
  notes?: string | null;
};

type Stress = {
  id?: string;
  rating?: number;
  time_of_day?: string | Date;
  symptoms?: $Enums.StressSymptoms[];
  notes?: string | null;
};

/**
 * @param id: string
 * @returns a form to update the current day the user selects
 * @dependencies DayFormContainer, SupplementFormV2, ExerciseFormV2, StressForm, HealthFormV2, SleepFormV2
 */

export default function UpdateDay({
  id,
  date,
  supplements,
  exercise,
  form_misc,
  health,
  sleep,
  stress,
}: {
  id: string;
  date: string;
  supplements: Supplements;
  exercise: Exercise;
  form_misc: Misc;
  health: Health;
  sleep: Sleep;
  stress: Stress;
}) {
  const form = useForm<z.infer<typeof daySchema>>({
    resolver: zodResolver(daySchema),
    defaultValues: {
      date,
      supplements:
        supplements.length > 0
          ? {
              toggle: true,
              input: supplements.map((s) => ({
                consumed_amount: s.amount,
                consumed_unit: s.measurement as $Enums.Measurements,
                time: s.time_taken,
                ingredients: s.supplement?.ingredients,
                description: s.supplement?.description,
                supplements_id: s.id,
                supplement: { ...s.supplement },
              })),
            }
          : { toggle: false },
      exercise: exercise[0] ?? undefined,
      // this is a hack. I need to find a better way to do this
      misc: form_misc,
      health,
      sleep,
      stress: {
        ...stress,
      },
    },
  });

  const onSubmit = async (data: z.infer<typeof daySchema>) => {
    // transform data to updateSchema
    const updateData: z.infer<typeof updateSchema> = {
      ...data,
      id,
      supplements: data?.supplements?.input
        ? data.supplements.input.map((s) => ({
            id: s.supplements_id,
            consumed_amount: s.consumed_amount,
            consumed_unit: s.consumed_unit,
            time: s.time as Date | null, // time is being updated wrong
            consumed_supplement_id: s.supplement.id!,
          }))
        : [],
      exercise: data.exercise,
    };

    await editDayAction(updateData, date);
  };

  const formInitState = useFormNodes({
    supplements: supplements.length,
    exercise: exercise.length,
  });

  return (
    <DayFormContainer
      initialState={formInitState}
      form={form}
      onSubmit={onSubmit}
    />
  );
}

const useFormNodes = ({
  supplements,
  exercise,
}: {
  supplements: number;
  exercise: number;
}) => {
  const output: Node[] = [];
  if (supplements > 0) output.push(ConfiguredSupplements);
  if (exercise) output.push(ExerciseFormV2);
  return output;
};
