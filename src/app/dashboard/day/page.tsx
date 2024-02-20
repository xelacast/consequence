import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { DatePicker } from "./components/datePicker";
import React from "react";

import type { day } from "@prisma/client";

export default async function Page() {
  return (
    <div>
      <DatePicker />
    </div>
  );
}
