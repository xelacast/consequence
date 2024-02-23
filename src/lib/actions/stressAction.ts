"use server";

import type { z } from "zod";
import type { stressSchema } from "~/components/forms/day/schema";
import { db } from "../../server/db";
import { currentUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import { revalidateTag } from "next/cache";
import { currentDay } from "~/lib/dates";

export async function createStressAction(
  formData: z.infer<typeof stressSchema>,
) {
  "use server";

  // alter data
  const user = await currentUser();

  if (!user) return; // throw error. This wouldn't be possible bc user has to be logged into this page to access this.

  const { id, emailAddresses } = user;
  if (emailAddresses.length < 1 || !emailAddresses[0]) return;
  const { emailAddress } = emailAddresses[0];

  if (!user?.id) return { error: "Forbidden", status: 403 };

  const { startOfDay, endOfDay } = currentDay(new Date());

  const data = (day_id: string) => ({
    rating: formData.rating,
    notes: formData.notes,
    symptoms: formData.symptoms,
    time_of_day: formData.time_of_day,
    day_id,
  });

  // find the day
  let day;
  try {
    // find day or create day
    day = await db.day.findFirst({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        user: { clerk_id: id, email: emailAddress },
      },
    });
    if (day) {
      // create sleep attached to the day
      await db.stress.create({
        data: data(day.id),
      });
    } else {
      // create day and health
      day = await db.day.create({
        data: {
          date: dayjs().toISOString(),
          user: { connect: { clerk_id: id, email: emailAddress } },
        },
      });
      await db.stress.create({
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
