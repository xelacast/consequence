import dayjs from "dayjs";
import { redirect } from "next/navigation";

export default async function Page() {
  redirect(`/dashboard/day/${dayjs().format("YYYY-MM-DD")}`);
}
