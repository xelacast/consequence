import { DayForms } from "~/components/day";

export default function Page({ params }: { params: { date: string } }) {
  // create a day based on the date and the user id
  const { date } = params;
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
}
