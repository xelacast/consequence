import type { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { DayForms } from "~/components/day";
import { db } from "~/server/db";

const Page = ({ id }: { id: Params }) => {
  console.log(id);
  // return <DayForms />;
  return <div>Day</div>;
};

export default Page;
