"use client";

import { ExerciseFormV2 } from "~/components/forms/day/exercise";
import { HealthFormV2 } from "~/components/forms/day/health";
import { MiscForm } from "~/components/forms/day/misc";
import { SleepFormV2 } from "~/components/forms/day/sleep";
import { SupplementFormV2 } from "~/components/forms/day/supplements";
import { StressForm } from "./forms/day/stress";

export const DayForms = () => {
  return (
    <section className="grid-template-rows: repeat(3, minmax(0, 1fr)) grid gap-4 p-4">
      <SupplementFormV2 />
      <SleepFormV2 />
      <ExerciseFormV2 />
      <HealthFormV2 />
      <StressForm />
      <MiscForm />
    </section>
  );
};
