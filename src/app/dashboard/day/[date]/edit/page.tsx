import { readDayData } from "~/lib/data/day";
import UpdateDay from "../../components/updateDay";

const Page = async ({ params }: { params: { date: string } }) => {
  // load data from day and render the form with the data
  const { date } = params;
  const { supplements, day, exercise, form_misc, health, sleep, stress } =
    await readDayData(date, true);

  const { id } = day; // day will never be undefined with editing = true. ts is not picking that up.

  // can I resuse the day form and make default values but send it to an update???
  // how can I detect which fields are being updated? and then trigger only those fields?

  // first approach I am going to use one big form

  return (
    <UpdateDay
      id={id}
      supplements={supplements}
      exercise={exercise}
      form_misc={form_misc}
      health={health}
      sleep={sleep}
      stress={stress}
    />
  );
};

export default Page;
