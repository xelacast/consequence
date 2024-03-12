import { readDayData } from "~/lib/data/day";
import { DatePicker } from "../components/datePicker";
import type { $Enums, ingredient } from "@prisma/client";
import dayjs from "dayjs";
import { CreateDayButton } from "../components/handlers";
import { SupplementHoverCard } from "../../configure/supplements/components/supplementHover";
import { toCapitalize } from "~/lib/misc/useUpperCase";
import { currentTime } from "~/lib/dates";

export default async function Page({ params }: { params: { date: string } }) {
  const { date } = params;
  const { supplements, id, exercise, form_misc, health, sleep, stress } =
    await readDayData(date);

  return (
    <div className="container">
      <DatePicker date={date} />
      <SupplementContainer supplements={supplements} />
      <ExerciseContainer exercise={exercise} />
      <SleepContainer data={sleep} />
      <HealthContainer health={health} />
      <StressContainer stress={stress} />
      <FormMiscContainer form_misc={form_misc} />
      <CreateDayButton dayId={id} date={date} />
    </div>
  );
}

const FormMiscContainer = ({ form_misc }: { form_misc: FormMisc }) => {
  return (
    <section className="rounded-lg border p-2">
      <h2>Miscellaneous</h2>
      <div>Meditation: {form_misc?.meditation ? "Yes" : "No"}</div>
      <div>
        Intermittent Fasting: {form_misc?.intermittent_fasting ? "Yes" : "No"}
      </div>
      <div>Cold Shower: {form_misc?.cold_shower ? "Yes" : "No"}</div>
    </section>
  );
};

export type FormMisc =
  | {
      id: string;
      meditation: boolean;
      intermittent_fasting: boolean;
      cold_shower: boolean;
      day_id: string;
    }
  | null
  | undefined;

export type Stress =
  | {
      id: string;
      rating: number;
      time_of_day: Date;
      symptoms: $Enums.StressSymptoms[];
      notes: string | null;
    }[]
  | undefined;

const StressContainer = ({ stress }: { stress: Stress }) => {
  return (
    <section className="rounded-lg border p-2">
      <h2>Stress</h2>
      {stress?.map((s) => (
        <div key={s.id}>
          <div>Rating: {s.rating}</div>
          <div>
            Time of Day:{" "}
            {dayjs(s.time_of_day).format("YYYY-MM-DDTHH:mm:ssZ[Z]")}
          </div>
          <div>
            Symptoms:{" "}
            {s.symptoms.map((sym) => <span key={sym}>{sym}</span>) ?? "N/A"}
          </div>
          <div>Notes: {s.notes ?? "N/A"}</div>
        </div>
      ))}
    </section>
  );
};

export type Health =
  | {
      id: string;
      notes: string | null;
      energy_levels: number;
      physical_health: number;
      mental_health: number;
      physical_health_description: $Enums.PhysicalHealthDescriptors[];
      mental_health_description: $Enums.MentalHealthDescriptors[];
    }[]
  | undefined;

const HealthContainer = ({ health }: { health: Health }) => {
  return (
    <section className="rounded-lg border p-2">
      <h2>Health</h2>
      {health?.map((h) => (
        <div key={h.id}>
          <div>Notes: {h?.notes ?? "N/A"}</div>
          <div>Energy Levels: {h?.energy_levels ?? "N/A"}</div>
          <div>Physical Health: {h?.physical_health ?? "N/A"}</div>
          <div>Mental Health: {h?.mental_health ?? "N/A"}</div>
          <div>
            Physical Health Description:{" "}
            {h?.physical_health_description.map((desc) => (
              <span key={desc}>{desc}</span>
            )) ?? "N/A"}
          </div>
          <div>
            Mental Health Description:{" "}
            {h?.mental_health_description.map((desc) => (
              <span key={desc}>{desc}</span>
            )) ?? "N/A"}
          </div>
        </div>
      ))}
    </section>
  );
};

export type Sleep =
  | {
      id: string;
      hours: number;
      quality: string[];
      notes: string | null;
    }
  | null
  | undefined;

const SleepContainer = ({ data }: { data: Sleep }) => {
  return (
    <section className="rounded-lg border p-2">
      <h3>Sleep</h3>
      <div>Hours: {data?.hours ?? "N/A"}</div>
      <div>Quality: {data?.quality ?? "N/A"}</div>
      <div>Notes: {data?.notes ?? "N/A"}</div>
    </section>
  );
};

export type Exercise = {
  id: string;
  type: $Enums.ExerciseType;
  duration: number;
  time_of_day: Date;
  intensity: string;
  fasted: boolean;
}[];

const ExerciseContainer = ({ exercise }: { exercise: Exercise }) => {
  return (
    <section className="rounded-lg border p-2">
      <h3>Exercise</h3>
      {exercise?.map((ex) => (
        <div key={ex.id}>
          <div>Type: {ex?.type ?? "N/A"}</div>
          <div>Duration: {ex?.duration ? ex.duration + " Min" : "N/A"}</div>
          <div>
            Time of Day:{" "}
            {dayjs(ex?.time_of_day).format("YYYY-MM-DDTHH:mm:ssZ[Z]")}
          </div>
          <div>Intensity: {ex?.intensity}</div>
          <div>Fasted: {ex?.fasted ? "Yes" : "No"}</div>
        </div>
      ))}
    </section>
  );
};

type PartialSupplement = {
  name: string;
  brand_name: string;
  serving_size: number;
  serving_size_unit: $Enums.Measurements;
  description: string | null;
  ingredients: ingredient[];
} | null;

export type Supplements = {
  id: string;
  amount: number;
  time_taken: Date | null;
  measurement: $Enums.Measurements;
  supplement: PartialSupplement;
}[];

/**
 *
 * @param supplements
 * @returns HoverCard for the supplements
 * @description This component is for the supplements section of the day page (READ)
 */
const SupplementContainer = ({ supplements }: { supplements: Supplements }) => {
  return (
    <section>
      <div className="rounded-lg border p-2">
        <h3>Supplements</h3>
        <ul className="wrap flex flex-row flex-wrap gap-2">
          {supplements?.map((field) => (
            <li key={field.id} className="basis-full md:basis-auto">
              <SupplementHoverCard supplement={field.supplement}>
                <div className="flex flex-grow cursor-pointer flex-col rounded-md bg-gradient-to-tr from-[#EE9CA7] to-[#FFDDE1] p-3 px-4 font-mono">
                  <div className="flex justify-between">
                    <div>{currentTime(field?.time_taken)}</div>
                    <div>
                      {field.amount}
                      {field.measurement == "capsule"
                        ? " capsule(s)"
                        : field.measurement}
                    </div>
                  </div>
                  <div className="flex justify-center text-lg">
                    {toCapitalize(field.supplement?.name)} -{" "}
                    {toCapitalize(field.supplement?.brand_name)}
                  </div>
                </div>
              </SupplementHoverCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
