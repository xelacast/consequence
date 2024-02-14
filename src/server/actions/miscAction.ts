"use server";

import { currentUser } from "@clerk/nextjs";
import { revalidateTag } from "next/cache";
import type { z } from "zod";
import type { miscSchema } from "~/components/forms/day/schema";
import { currentDay } from "./healthAction";
import { db } from "../db";

export const createMiscAction = async (
  formData: z.infer<typeof miscSchema>,
) => {
  "use server";

  // verify user
  const user = await currentUser();

  if (!user) return { error: "error", status: 403, message: "Unothorized" };

  const { id, emailAddresses } = user;
  if (emailAddresses.length < 1 || !emailAddresses[0]) return;
  const { emailAddress } = emailAddresses[0];

  // create data format function with dayid as argument

  const miscData = (dayId: string) => ({
    ...formData,
    day_id: dayId,
  });
  // date initializer
  const { today, endOfDay } = currentDay(new Date());

  // day finder/creator
  let day;
  try {
    day = await db.day.findFirst({
      where: {
        user: { clerk_id: id },
        date: { gte: today, lt: endOfDay },
      },
    });
    if (day) {
      await db.form_misc.create({
        data: miscData(day.id),
      });
    } else {
      // if day does not exist, create day and exercise
      day = await db.day.create({
        data: {
          date: today,
          user: { connect: { clerk_id: id, email: emailAddress } },
        },
      });
      await db.form_misc.create({
        data: miscData(day.id),
      });
    }
  } catch (err) {
    return { error: "error", status: 500, message: "FUCK THERES an error" };
  }

  // revalidate
  revalidateTag("form_misc");
  return { message: "success", error: "", status: 202 };
  // create misc
};

// edit action

// delete action
