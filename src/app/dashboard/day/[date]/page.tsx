import { readDayData } from "~/lib/data/day";
import { DatePicker } from "../components/datePicker";
import type { $Enums } from "@prisma/client";
import dayjs from "dayjs";
import { CreateDayButton } from "../components/handlers";

export default async function Page({ params }: { params: { date: string } }) {
  const { date } = params;
  const { supplements, day, exercise, form_misc, health, sleep, stress } =
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
      <CreateDayButton dayId={day?.id} date={date} />
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

type FormMisc =
  | {
      id: string;
      meditation: boolean;
      intermittent_fasting: boolean;
      cold_shower: boolean;
      day_id: string;
    }
  | null
  | undefined;

type Stress =
  | {
      id: string;
      date: Date;
      rating: number;
      time_of_day: Date;
      stressors: string | null;
      symptoms: $Enums.StressSymptoms[];
      notes: string | null;
      day_id: string;
    }[]
  | undefined;

const StressContainer = ({ stress }: { stress: Stress }) => {
  return (
    <section className="rounded-lg border p-2">
      <h2>Stress</h2>
      {stress?.map((s) => (
        <div key={s.id}>
          <div>Date: {dayjs(s.date).format("YYYY-MM-DDTHH:mm:ssZ[Z]")}</div>
          <div>Rating: {s.rating}</div>
          <div>
            Time of Day:{" "}
            {dayjs(s.time_of_day).format("YYYY-MM-DDTHH:mm:ssZ[Z]")}
          </div>
          <div>Stressors: {s.stressors ?? "N/A"}</div>
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

type Health =
  | {
      id: string;
      notes: string | null;
      weight: number | null;
      energy_levels: number;
      physical_health: number;
      mental_health: number;
      physical_health_description: $Enums.PhysicalHealthDescriptors[];
      mental_health_description: $Enums.MentalHealthDescriptors[];
      date: Date;
    }[]
  | undefined;

const HealthContainer = ({ health }: { health: Health }) => {
  return (
    <section className="rounded-lg border p-2">
      <h2>Health</h2>
      {health?.map((h) => (
        <div key={h.id}>
          <div>Notes: {h?.notes ?? "N/A"}</div>
          <div>Weight: {h?.weight ?? "N/A"}</div>
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

type Sleep =
  | {
      id: string;
      hours: number;
      quality: string[];
      notes: string | null;
    }
  | null
  | undefined;
// wake_time: Date;
// sleep_time: Date;

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

type Exercise = {
  id: string;
  type: $Enums.ExerciseType;
  duration: number;
  time_of_day: Date;
  intensity: string;
  fasted: boolean;
};
const ExerciseContainer = ({
  exercise,
}: {
  exercise: Exercise[] | undefined;
}) => {
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

type Supps = {
  id: string;
  // date: Date;
  name: $Enums.Supplements;
  amount: number;
  // time_of_day_taken: $Enums.TimeOfDay | null;
  time_taken: Date | null;
  measurement: $Enums.Measurements;
  // day_id: string;
};

const SupplementContainer = ({
  supplements,
}: {
  supplements: Supps[] | undefined;
}) => {
  return (
    <section className="rounded-lg border p-2">
      <h3>Supplements</h3>
      <div className="flex flex-wrap gap-2">
        {supplements?.map((supp) => (
          <div
            // className="xs:w-full grid max-w-full grid-cols-3 gap-2 rounded-md border bg-white p-2 shadow-sm md:w-1/3 lg:w-1/4"
            className="flex w-1/3 flex-row gap-2 rounded-md border bg-white p-2 shadow-sm"
            key={supp.id}
          >
            <div>{supp.name.split("_").join(" ")}</div>
            <span>
              {supp.amount} {supp.measurement}
            </span>
            <div>
              {dayjs(supp.time_taken).format("YYYY-MM-DDTHH:mm:ssZ[Z]") ??
                "N/A"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
