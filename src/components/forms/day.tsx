"use client";

import { SupplementFormV2 } from "./day/supplements";
import { SleepFormV2 } from "./day/sleep";
import { ExerciseFormV2 } from "./day/exercise";
import { MiscForm } from "./day/misc";
import { HealthFormV2 } from "./day/health";

export function DayForm() {
  return (
    <>
      <SupplementFormV2 />
      <SleepFormV2 />
      <ExerciseFormV2 />
      <HealthFormV2 />
      <MiscForm />
    </>
  );
}
