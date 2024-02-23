import { DayForms } from "~/components/day";
import { ExerciseFormV2 } from "~/components/forms/day/exercise";
import { HealthFormV2 } from "~/components/forms/day/health";
import { MiscForm } from "~/components/forms/day/misc";
import { SleepFormV2 } from "~/components/forms/day/sleep";
import { StressForm } from "~/components/forms/day/stress";
import { SupplementFormV2 } from "~/components/forms/day/supplements";

export default function Page({ params }: { params: { date: string } }) {
  // create a day based on the date and the user id
  const { date } = params;
  return <DayForms date={date} />;
}
