import dayjs from "dayjs";
import { DatePicker } from "./components/datePicker";
import React from "react";

export default async function Page() {
  return (
    <div>
      <DatePicker date={dayjs().toDate()} />
    </div>
  );
}
