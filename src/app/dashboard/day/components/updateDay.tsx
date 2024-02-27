"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { daySchema } from "~/components/forms/day/schema";
import type { $Enums } from "@prisma/client";
import { DayFormContainer } from "~/components/day";
import { SupplementFormV2 } from "~/components/forms/day/supplements";
import { ExerciseFormV2 } from "~/components/forms/day/exercise";
import { useEffect } from "react";
import { MiscForm } from "~/components/forms/day/misc";
import { editDayAction } from "~/lib/actions/dayAction";
import { twentyFourHourClock } from "~/lib/dates";

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
 * @dependeencies DayFormContainer, SupplementFormV2, ExerciseFormV2, StressForm, HealthFormV2, SleepFormV2
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
  stress: Stress; // how will i show multiple stress forms with react-hook-form?
}) {
  const form = useForm<z.infer<typeof daySchema>>({
    resolver: zodResolver(daySchema),
    defaultValues: {
      supplements: {
        toggle: supplements.length > 0,
        supplements,
      },
      exercise: {
        toggle: exercise.length > 0,
        ...exercise[0]!, // this is a hack. I need to find a better way to do this
        time_of_day_string: twentyFourHourClock({
          time: exercise[0]?.time_of_day,
        }),
      },
      misc: form_misc,
      health,
      sleep,
      stress: {
        ...stress,
        time_of_day_string: twentyFourHourClock({ time: stress.time_of_day }),
      },
    },
  });

  // delete me
  useEffect(() => {
    console.log("errors", form.formState.errors);
  }, [form.formState.errors]);

  const onSubmit = async (data: z.infer<typeof daySchema>) => {
    // transform data to updateSchema
    const updateData = {
      ...data,
      id,
      supplements: data.supplements?.supplements,
      exercise: data.exercise,
    };

    await editDayAction(updateData, date);
  };

  // TODO: Find a better way to do this. When there is more data/forms to fill out it will need to be configered somewhere. Also forms will show up without correct data
  // this is adding forms to the edit regardless of the data
  const t = [
    { node: SupplementFormV2, key: "1" },
    { node: ExerciseFormV2, key: "2" },
    { node: MiscForm, key: "3" },
  ];

  return <DayFormContainer initialState={t} form={form} onSubmit={onSubmit} />;
}
