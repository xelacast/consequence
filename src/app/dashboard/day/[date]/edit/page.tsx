import { readDayDataForEdit } from "~/lib/data/day";
import UpdateDay from "../../components/updateDay";

const Page = async ({ params }: { params: { date: string } }) => {
  // load data from day and render the form with the data
  const { date } = params;
  const { supplements, id, exercise, form_misc, health, sleep, stress } =
    await readDayDataForEdit(date);

  // can I reuse the day form and make default values but send it to an update???
  // how can I detect which fields are being updated? and then trigger only those fields?
  // ? Should I parse the data with the daySchema?

  return (
    <UpdateDay
      date={date}
      id={id}
      supplements={supplements}
      // @ts-expect-error look below
      exercise={exercise} // errors in config string != "low" | "medium" | "high" schema
      form_misc={form_misc}
      health={health}
      sleep={sleep}
      stress={stress}
    />
  );
};

export default Page;
