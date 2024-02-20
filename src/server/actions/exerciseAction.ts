"use server";

import type { exerciseSchema } from "~/components/forms/day/schema";
import { db } from "../db";
import type { z } from "zod";
import { currentUser } from "@clerk/nextjs";
import { currentDay } from "../../lib/dates";
import { revalidateTag } from "next/cache";
import dayjs from "../../lib/dates";

/**
 ** Be careful when you use this to let user back track data. We dont want a date of today for being used for a date of yesterday or prior dates
 */

export const createExerciseAction = async (
  formData: z.infer<typeof exerciseSchema>,
) => {
  "use server";

  // verify user
  const user = await currentUser();

  if (!user) return { error: "error", status: 403, message: "Unothorized" };

  const { id, emailAddresses } = user;
  if (emailAddresses.length < 1 || !emailAddresses[0]) return;
  const { emailAddress } = emailAddresses[0];

  if (!user) return { error: "error", status: 403, message: "Unothorized" };

  // create data format function with dayid as argument
  const exerciseData = (dayId: string) => ({
    duration: formData.duration,
    type: formData.type,
    intensity: formData.intensity,
    fasted: formData.fasted,
    time_of_day: formData.time_of_day,
    day_id: dayId,
  });

  // date initializer
  const { startOfDay, endOfDay } = currentDay(dayjs().toDate());

  // day finder/creator
  let day;
  try {
    day = await db.day.findFirst({
      where: {
        user: { clerk_id: id },
        date: { gte: startOfDay, lt: endOfDay },
      },
    });
    if (day) {
      await db.exercise.create({
        data: exerciseData(day.id),
      });
    } else {
      // if day does not exist, create day and exercise
      day = await db.day.create({
        data: {
          date: startOfDay,
          user: { connect: { clerk_id: id, email: emailAddress } },
        },
      });
      await db.exercise.create({
        data: exerciseData(day.id),
      });
    }
  } catch (err) {
    return { error: "error", status: 500, message: "FUCK THERES an error" };
  }

  // revalidate
  revalidateTag("exercise");
  return { message: "success", error: "", status: 202 };
};
