import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { DatePicker } from "./datePicker";
import React from "react";

import type { day } from "@prisma/client";

export const DayContainer = async () => {
  return (
    <div>
      <DatePicker />
      <ReadDay />
    </div>
  );
};

const ReadDay = ({ data }: { data: day }) => {
  return (
    <div>
      <h1>Day</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
