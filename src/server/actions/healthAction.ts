"use server";

import { z } from "zod";
import { healthSchema } from "~/components/forms/day/schema";
import { db } from "../db";
import { currentUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import { revalidateTag } from "next/cache";

export async function createHealthAction(
  formData: z.infer<typeof healthSchema>,
) {
  "use server";

  // alter data
  const user = await currentUser();

  if (!user) return; // throw error. This wouldn't be possible bc user has to be logged into this page to access this.

  const { id, emailAddresses } = user;
  if (emailAddresses.length < 1 || !emailAddresses[0]) return;
  const { emailAddress } = emailAddresses[0];

  if (!user?.id) return;

  // create or connect to a day
  const { today, endOfDay } = currentDay(new Date());

  // find the day
  let day;
  try {
    // find day or create day
    day = await db.day.findFirst({
      where: {
        date: { gte: today, lte: endOfDay },
        user: { clerk_id: id, email: emailAddress },
      },
    });
    if (day) {
      // create health attacked to the day
      await db.health.create({
        data: {
          energy_levels: formData.energy_level,
          mental_health: formData.mental_health,
          physical_health: formData.physical_health,
          time: dayjs().toISOString(),
          day: { connect: { id: day.id } },
        },
      });
    } else {
      // create day and health
      day = await db.day.create({
        data: {
          date: dayjs().toISOString(),
          user: { connect: { clerk_id: id, email: emailAddress } },
        },
      });
      await db.health.create({
        data: {
          energy_levels: formData.energy_level,
          mental_health: formData.mental_health,
          physical_health: formData.physical_health,
          time: dayjs().toISOString(),
          day: { connect: { id: day.id } },
        },
      });
    }
  } catch (err) {
    return { error: "Error on server. Status 500" };
  }

  revalidateTag("health");
  // refresh cache
  // ? What if we dont want to refresh the page but refresh the cache?
}

export const currentDay = (date: string | Date) => {
  // get start of day MM/DD/YYYY
  const today = dayjs(date).startOf("day").toISOString();
  const endOfDay = dayjs(date).endOf("day").toISOString();
  console.log(today, endOfDay);

  // get end of day
  return { today, endOfDay };
};
