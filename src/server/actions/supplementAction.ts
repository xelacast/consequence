"use server";

import type { z } from "zod";
import { supplementSchema } from "~/components/forms/day/schema";
import { db } from "../db";
import { currentUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import { revalidateTag } from "next/cache";
import { currentDay } from "./healthAction";
import { type day as daySchema } from "@prisma/client";

const postSupplementSchema = supplementSchema.omit({
  amount: true,
  time_of_day: true,
  name: true,
});

export async function createSupplementAction(
  formData: z.infer<typeof postSupplementSchema>,
) {
  "use server"; // is this needed if the function is in a server component?

  const user = await currentUser();

  if (!user) return; // throw error. This wouldn't be possible bc user has to be logged into this page to access this.

  const { id, emailAddresses } = user;
  if (emailAddresses.length < 1 || !emailAddresses[0]) return;
  const { emailAddress } = emailAddresses[0];

  if (!user?.id) return { error: "Forbidden", status: 403 };

  const { today, endOfDay } = currentDay(new Date());

  const data = (dayId: string) =>
    formData.supplements.map((supplement) => {
      return {
        name: supplement.supplement,
        amount: supplement.amount,
        time_of_day_taken: supplement.time_of_day,
        day_id: dayId,
      };
    });
  // find the day
  let day: daySchema | null = null;
  try {
    // find day or create day
    day = await db.day.findFirst({
      where: {
        date: { gte: today, lte: endOfDay },
        user: { clerk_id: id },
      },
    });
    if (day) {
      // create supplements attached to the day
      await db.supplements.createMany({
        data: data(day.id),
      });
    } else {
      // create day and supplements
      day = await db.day.create({
        data: {
          date: dayjs().toISOString(),
          user: { connect: { clerk_id: id, email: emailAddress } },
        },
      });
      await db.supplements.createMany({
        data: data(day.id),
      });
    }
  } catch (err) {
    return { error: "Error on server. Status 500" };
  }

  revalidateTag("health");
  // refresh cache
  // ? What if we dont want to refresh the page but refresh the cache?
}
